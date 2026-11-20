import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Upload, 
  Image as ImageIcon, 
  Eye, 
  EyeOff, 
  ArrowUp, 
  ArrowDown, 
  Check, 
  X, 
  Sparkles, 
  ExternalLink, 
  Smartphone, 
  Monitor, 
  Crop, 
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { broadcastLiveEvent, SYNC_EVENTS } from '../utils/liveSync';

export default function AdminBannerManager({ token, showNotification, isSuperAdmin }) {
  const [banners, setBanners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [previewDevice, setPreviewDevice] = useState('desktop'); // 'desktop' | 'mobile'

  // Form Fields
  const [formTitle, setFormTitle] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formBadge, setFormBadge] = useState('WHO-GMP CERTIFIED');
  const [formLink, setFormLink] = useState('/quick-order');
  const [formCtaText, setFormCtaText] = useState('Fast Quick Order ⚡');
  const [formOrder, setFormOrder] = useState(1);
  const [formActive, setFormActive] = useState(true);
  const [formAspectRatio, setFormAspectRatio] = useState('auto');
  const [formImage, setFormImage] = useState('');

  // Smart Canvas Resizer State
  const [rawImageSrc, setRawImageSrc] = useState('');
  const [resizeMode, setResizeMode] = useState('smart-fit'); // 'smart-fit' | 'cover' | 'raw'
  const canvasRef = useRef(null);

  // Fetch Banners
  const fetchBanners = async () => {
    setIsLoading(true);
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch('/api/banners/all', { headers });
      const data = await res.json();
      if (data.success && Array.isArray(data.banners)) {
        setBanners(data.banners);
      } else {
        // Fallback to public list
        const pubRes = await fetch('/api/banners');
        const pubData = await pubRes.json();
        if (pubData.success && Array.isArray(pubData.banners)) {
          setBanners(pubData.banners);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch banners:', err);
      showNotification?.('Could not load banners from server. Displaying local cache.', 'warning');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // Open modal for Create
  const handleOpenAddModal = () => {
    setEditingBanner(null);
    setFormTitle('');
    setFormSubtitle('');
    setFormBadge('WHO-GMP CERTIFIED');
    setFormLink('/quick-order');
    setFormCtaText('Fast Quick Order ⚡');
    setFormOrder(banners.length + 1);
    setFormActive(true);
    setFormAspectRatio('auto');
    setFormImage('');
    setRawImageSrc('');
    setResizeMode('smart-fit');
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEditModal = (banner) => {
    setEditingBanner(banner);
    setFormTitle(banner.title || '');
    setFormSubtitle(banner.subtitle || '');
    setFormBadge(banner.badge || 'WHO-GMP CERTIFIED');
    setFormLink(banner.link || '/quick-order');
    setFormCtaText(banner.ctaText || 'Fast Quick Order ⚡');
    setFormOrder(banner.order || 1);
    setFormActive(banner.active !== false);
    setFormAspectRatio(banner.aspectRatio || 'auto');
    setFormImage(banner.image || '');
    setRawImageSrc(banner.image || '');
    setIsModalOpen(true);
  };

  // Handle Image File Upload & Process via HTML5 Canvas
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showNotification?.('Please upload a valid image file (PNG, JPG, WEBP)', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result;
      if (src) {
        setRawImageSrc(src);
        processCanvasImage(src, resizeMode);
      }
    };
    reader.readAsDataURL(file);
  };

  // Process image with HTML5 Canvas (Smart Ambient Fit vs Cover Crop)
  const processCanvasImage = (src, mode) => {
    if (!src) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const naturalW = img.naturalWidth || img.width;
      const naturalH = img.naturalHeight || img.height;

      // Determine aspect ratio class
      const ratio = naturalW / naturalH;
      let detectedAspect = 'landscape';
      if (ratio > 1.4) detectedAspect = 'landscape';
      else if (ratio >= 0.9 && ratio <= 1.4) detectedAspect = 'square';
      else detectedAspect = 'portrait';
      setFormAspectRatio(detectedAspect);

      if (mode === 'raw') {
        setFormImage(src);
        return;
      }

      // Standard High-Res Hero Banner Canvas (1920x650)
      const targetW = 1280;
      const targetH = 500;
      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setFormImage(src);
        return;
      }

      if (mode === 'cover') {
        // Exact Cover Crop
        const scale = Math.max(targetW / naturalW, targetH / naturalH);
        const nw = naturalW * scale;
        const nh = naturalH * scale;
        const nx = (targetW - nw) / 2;
        const ny = (targetH - nh) / 2;
        ctx.drawImage(img, nx, ny, nw, nh);
      } else {
        // Smart Ambient Fit (Blurred glow background + crisp centered artwork)
        // 1. Draw blurred, scaled ambient fill
        ctx.save();
        ctx.filter = 'blur(28px) brightness(0.45)';
        const bgScale = Math.max(targetW / naturalW, targetH / naturalH) * 1.15;
        const bgW = naturalW * bgScale;
        const bgH = naturalH * bgScale;
        ctx.drawImage(img, (targetW - bgW) / 2, (targetH - bgH) / 2, bgW, bgH);
        ctx.restore();

        // 2. Dark navy gradient overlay
        const grad = ctx.createLinearGradient(0, 0, targetW, 0);
        grad.addColorStop(0, 'rgba(10, 38, 70, 0.85)');
        grad.addColorStop(0.5, 'rgba(10, 38, 70, 0.40)');
        grad.addColorStop(1, 'rgba(10, 38, 70, 0.85)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, targetW, targetH);

        // 3. Draw foreground image intact without cropping
        const fgScale = Math.min((targetW * 0.55) / naturalW, (targetH * 0.88) / naturalH);
        const fw = naturalW * fgScale;
        const fh = naturalH * fgScale;
        const fx = targetW * 0.68 - fw / 2;
        const fy = (targetH - fh) / 2;

        // Shadow behind foreground card
        ctx.shadowColor = 'rgba(0, 0, 0, 0.55)';
        ctx.shadowBlur = 24;
        ctx.drawImage(img, fx, fy, fw, fh);
      }

      const generatedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
      setFormImage(generatedDataUrl);
    };
    img.src = src;
  };

  const handleModeChange = (newMode) => {
    setResizeMode(newMode);
    if (rawImageSrc) {
      processCanvasImage(rawImageSrc, newMode);
    }
  };

  // Save Banner (POST or PUT)
  const handleSaveBanner = async (e) => {
    e.preventDefault();
    if (!formImage) {
      showNotification?.('Please upload or provide an image for the banner', 'error');
      return;
    }

    const payload = {
      title: formTitle.trim() || 'Niyansh Pharma Wholesale Distribution',
      subtitle: formSubtitle.trim() || 'Genuine Formulations Across Saurashtra & Gujarat',
      badge: formBadge.trim() || 'WHO-GMP CERTIFIED',
      image: formImage,
      link: formLink.trim() || '/quick-order',
      ctaText: formCtaText.trim() || 'Fast Quick Order ⚡',
      order: Number(formOrder) || 1,
      active: formActive,
      aspectRatio: formAspectRatio
    };

    try {
      const url = editingBanner ? `/api/banners/${editingBanner._id}` : '/api/banners';
      const method = editingBanner ? 'PUT' : 'POST';
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      };

      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        showNotification?.(data.message || 'Banner saved successfully!', 'success');
        setIsModalOpen(false);
        fetchBanners();
        broadcastLiveEvent(SYNC_EVENTS.SETTINGS_UPDATED, { action: 'banner_saved' });
      } else {
        showNotification?.(data.message || 'Failed to save banner', 'error');
      }
    } catch (err) {
      console.error('Error saving banner:', err);
      showNotification?.('Server communication error. Please try again.', 'error');
    }
  };

  // Toggle Active State
  const handleToggleActive = async (banner) => {
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(`/api/banners/${banner._id}/toggle`, {
        method: 'PATCH',
        headers
      });
      const data = await res.json();
      if (data.success) {
        showNotification?.(data.message, 'success');
        setBanners(prev => prev.map(b => b._id === banner._id ? { ...b, active: data.active } : b));
        broadcastLiveEvent(SYNC_EVENTS.SETTINGS_UPDATED, { action: 'banner_toggled' });
      }
    } catch (err) {
      showNotification?.('Failed to toggle banner status', 'error');
    }
  };

  // Delete Banner
  const handleDeleteBanner = async (id) => {
    if (!window.confirm('Are you sure you want to delete this banner?')) return;

    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(`/api/banners/${id}`, {
        method: 'DELETE',
        headers
      });
      const data = await res.json();
      if (data.success) {
        showNotification?.('Banner deleted successfully', 'success');
        setBanners(prev => prev.filter(b => b._id !== id));
        broadcastLiveEvent(SYNC_EVENTS.SETTINGS_UPDATED, { action: 'banner_deleted' });
      }
    } catch (err) {
      showNotification?.('Failed to delete banner', 'error');
    }
  };

  // Move Order Up / Down
  const handleMoveOrder = async (idx, direction) => {
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= banners.length) return;

    const newBanners = [...banners];
    const temp = newBanners[idx];
    newBanners[idx] = newBanners[targetIdx];
    newBanners[targetIdx] = temp;

    // Recalculate orders
    const orders = newBanners.map((b, i) => ({ id: b._id, order: i + 1 }));
    setBanners(newBanners.map((b, i) => ({ ...b, order: i + 1 })));

    try {
      const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      };
      await fetch('/api/banners/reorder', {
        method: 'POST',
        headers,
        body: JSON.stringify({ orders })
      });
      broadcastLiveEvent(SYNC_EVENTS.SETTINGS_UPDATED, { action: 'banners_reordered' });
    } catch (err) {
      console.warn('Reorder failed:', err);
    }
  };

  return (
    <div className="admin-banner-manager-container animate-fade-in" style={{ padding: '4px 0' }}>
      {/* Header Bar */}
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: '14px', 
          marginBottom: '22px',
          backgroundColor: 'var(--bg-surface, #ffffff)',
          padding: '16px 20px',
          borderRadius: '12px',
          border: '1px solid var(--border-light, #e2e8f0)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}
      >
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0, color: 'var(--text-dark, #0f172a)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ImageIcon size={22} color="var(--primary-blue, #0c3d6c)" />
            Homepage Hero Banners & Slider Manager
          </h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.84rem', color: 'var(--text-muted, #64748b)' }}>
            Superadmin control for rotating homepage banners (Slide 1 is always the interactive Master Brand Hub, followed by these banners).
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            type="button"
            onClick={fetchBanners}
            className="btn btn-outline"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', fontSize: '0.84rem' }}
            title="Refresh banner roster"
          >
            <RefreshCw size={15} /> Refresh
          </button>

          <button
            type="button"
            onClick={handleOpenAddModal}
            className="btn btn-primary"
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '6px', 
              padding: '9px 18px', 
              fontSize: '0.88rem', 
              fontWeight: '700',
              backgroundColor: '#22c55e',
              border: 'none',
              boxShadow: '0 4px 12px rgba(34, 197, 94, 0.3)'
            }}
          >
            <Plus size={16} /> Add New Banner
          </button>
        </div>
      </div>

      {/* Live Banners Grid */}
      {isLoading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          <RefreshCw size={24} className="spin" style={{ margin: '0 auto 10px auto' }} />
          Loading banners...
        </div>
      ) : banners.length === 0 ? (
        <div style={{ padding: '48px 20px', textAlign: 'center', backgroundColor: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
          <ImageIcon size={44} color="#94a3b8" style={{ margin: '0 auto 12px auto' }} />
          <h3 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--text-dark)' }}>No Hero Banners Found</h3>
          <p style={{ margin: '6px 0 16px 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Get started by adding your first promotional banner.</p>
          <button onClick={handleOpenAddModal} className="btn btn-primary" style={{ backgroundColor: '#22c55e', border: 'none' }}>
            <Plus size={16} /> Add First Banner
          </button>
        </div>
      ) : (
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
            gap: '18px' 
          }}
        >
          {banners.map((banner, idx) => (
            <div 
              key={banner._id || idx}
              style={{
                backgroundColor: 'var(--bg-surface, #ffffff)',
                border: '1px solid var(--border-light, #e2e8f0)',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                display: 'flex',
                flexDirection: 'column',
                opacity: banner.active ? 1 : 0.65,
                transition: 'all 0.2s ease'
              }}
            >
              {/* Thumbnail Container */}
              <div 
                style={{
                  position: 'relative',
                  height: '170px',
                  backgroundColor: '#0a2647',
                  overflow: 'hidden'
                }}
              >
                <img 
                  src={banner.image} 
                  alt={banner.title} 
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: banner.aspectRatio === 'landscape' ? 'cover' : 'contain',
                    display: 'block'
                  }}
                />

                {/* Status Badges Overlay */}
                <div style={{ position: 'absolute', top: '10px', left: '10px', display: 'flex', gap: '6px' }}>
                  <span style={{ backgroundColor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', color: '#ffffff', fontSize: '0.72rem', fontWeight: '800', padding: '3px 8px', borderRadius: '6px' }}>
                    #{banner.order || idx + 1}
                  </span>
                  <span style={{ backgroundColor: banner.active ? '#22c55e' : '#64748b', color: '#ffffff', fontSize: '0.72rem', fontWeight: '800', padding: '3px 8px', borderRadius: '6px' }}>
                    {banner.active ? 'ACTIVE' : 'HIDDEN'}
                  </span>
                </div>

                {/* Aspect Badge */}
                <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                  <span style={{ backgroundColor: 'rgba(12, 61, 108, 0.85)', color: '#86efac', fontSize: '0.68rem', fontWeight: '800', padding: '3px 7px', borderRadius: '6px', textTransform: 'uppercase' }}>
                    {banner.aspectRatio || 'Auto'}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div style={{ padding: '14px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                {banner.badge && (
                  <span style={{ fontSize: '0.7rem', color: '#059669', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                    {banner.badge}
                  </span>
                )}
                <h4 style={{ margin: '0 0 6px 0', fontSize: '0.94rem', fontWeight: '800', color: 'var(--text-dark, #0f172a)', lineHeight: '1.3' }}>
                  {banner.title}
                </h4>
                <p style={{ margin: '0 0 12px 0', fontSize: '0.8rem', color: 'var(--text-muted, #64748b)', lineHeight: '1.45', flex: 1 }}>
                  {banner.subtitle}
                </p>

                <div style={{ fontSize: '0.76rem', color: '#64748b', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ExternalLink size={12} /> Target: <strong style={{ color: 'var(--primary-blue)' }}>{banner.link || '/quick-order'}</strong>
                </div>

                {/* Action Bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-light, #e2e8f0)', paddingTop: '10px' }}>
                  {/* Reorder Buttons */}
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      type="button"
                      onClick={() => handleMoveOrder(idx, -1)}
                      disabled={idx === 0}
                      title="Move Up"
                      style={{ padding: '5px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: idx === 0 ? '#f1f5f9' : '#ffffff', color: idx === 0 ? '#94a3b8' : '#334155', cursor: idx === 0 ? 'not-allowed' : 'pointer' }}
                    >
                      <ArrowUp size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveOrder(idx, 1)}
                      disabled={idx === banners.length - 1}
                      title="Move Down"
                      style={{ padding: '5px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: idx === banners.length - 1 ? '#f1f5f9' : '#ffffff', color: idx === banners.length - 1 ? '#94a3b8' : '#334155', cursor: idx === banners.length - 1 ? 'not-allowed' : 'pointer' }}
                    >
                      <ArrowDown size={13} />
                    </button>
                  </div>

                  {/* Toggle & Edit & Delete */}
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={() => handleToggleActive(banner)}
                      title={banner.active ? 'Hide Banner' : 'Show Banner'}
                      style={{ padding: '5px 10px', borderRadius: '6px', border: 'none', backgroundColor: banner.active ? '#fee2e2' : '#dcfce7', color: banner.active ? '#ef4444' : '#15803d', fontWeight: '700', fontSize: '0.78rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      {banner.active ? <EyeOff size={13} /> : <Eye size={13} />}
                      {banner.active ? 'Hide' : 'Activate'}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(banner)}
                      title="Edit Banner"
                      style={{ padding: '5px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: 'var(--primary-blue)', cursor: 'pointer' }}
                    >
                      <Edit2 size={14} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteBanner(banner._id)}
                      title="Delete Banner"
                      style={{ padding: '5px 8px', borderRadius: '6px', border: 'none', backgroundColor: '#fee2e2', color: '#ef4444', cursor: 'pointer' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================= */}
      {/* ADD / EDIT BANNER MODAL (With Smart HTML5 Canvas Cropper) */}
      {/* ========================================================= */}
      {isModalOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(6px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
        >
          <div 
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              maxWidth: '820px',
              width: '100%',
              maxHeight: '92vh',
              overflowY: 'auto',
              boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
              border: '1px solid #e2e8f0',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 22px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={18} color="#22c55e" />
                {editingBanner ? 'Edit Hero Banner' : 'Create New Hero Banner'}
              </h3>
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveBanner} style={{ padding: '20px 24px' }}>
              {/* Image Uploader & Smart Resizer */}
              <div style={{ marginBottom: '20px', padding: '16px', backgroundColor: '#f1f5f9', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
                <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>
                  Banner Image Source *
                </label>

                {/* Mode Selector */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                  <button
                    type="button"
                    onClick={() => handleModeChange('smart-fit')}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      border: resizeMode === 'smart-fit' ? '2px solid #22c55e' : '1px solid #cbd5e1',
                      backgroundColor: resizeMode === 'smart-fit' ? '#dcfce7' : '#ffffff',
                      color: resizeMode === 'smart-fit' ? '#15803d' : '#475569',
                      fontSize: '0.8rem',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    ✨ Smart Ambient Fit (Zero crop / safe)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleModeChange('cover')}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      border: resizeMode === 'cover' ? '2px solid #22c55e' : '1px solid #cbd5e1',
                      backgroundColor: resizeMode === 'cover' ? '#dcfce7' : '#ffffff',
                      color: resizeMode === 'cover' ? '#15803d' : '#475569',
                      fontSize: '0.8rem',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    ✂️ Cover Crop (16:9 Standard)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleModeChange('raw')}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      border: resizeMode === 'raw' ? '2px solid #22c55e' : '1px solid #cbd5e1',
                      backgroundColor: resizeMode === 'raw' ? '#dcfce7' : '#ffffff',
                      color: resizeMode === 'raw' ? '#15803d' : '#475569',
                      fontSize: '0.8rem',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    📁 Use As-Is (Original image)
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '10px', alignItems: 'center' }}>
                  <input
                    type="text"
                    required
                    placeholder="/banners/b1.jpeg or paste image URL / Base64"
                    value={formImage}
                    onChange={(e) => {
                      setFormImage(e.target.value);
                      setRawImageSrc(e.target.value);
                    }}
                    style={{
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.84rem'
                    }}
                  />

                  <label
                    className="btn btn-secondary"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '9px 16px',
                      fontSize: '0.84rem',
                      fontWeight: '700',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <Upload size={15} /> Upload Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>

                {/* Quick Presets from b1..b7 */}
                <div style={{ marginTop: '10px', display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: '700' }}>Quick Select:</span>
                  {[1, 2, 3, 4, 5, 6, 7].map(num => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => {
                        const path = `/banners/b${num}.jpeg`;
                        setFormImage(path);
                        setRawImageSrc(path);
                        processCanvasImage(path, resizeMode);
                      }}
                      style={{
                        padding: '2px 8px',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        backgroundColor: '#ffffff',
                        fontSize: '0.72rem',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      b{num}.jpeg
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Preview Toggle (Desktop vs Mobile) */}
              {formImage && (
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#475569' }}>
                      Live Preview before Saving:
                    </span>
                    <div style={{ display: 'inline-flex', gap: '4px', backgroundColor: '#e2e8f0', padding: '3px', borderRadius: '8px' }}>
                      <button
                        type="button"
                        onClick={() => setPreviewDevice('desktop')}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          border: 'none',
                          backgroundColor: previewDevice === 'desktop' ? '#ffffff' : 'transparent',
                          color: previewDevice === 'desktop' ? '#0f172a' : '#64748b',
                          fontSize: '0.76rem',
                          fontWeight: '700',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Monitor size={12} /> Desktop View
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewDevice('mobile')}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          border: 'none',
                          backgroundColor: previewDevice === 'mobile' ? '#ffffff' : 'transparent',
                          color: previewDevice === 'mobile' ? '#0f172a' : '#64748b',
                          fontSize: '0.76rem',
                          fontWeight: '700',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Smartphone size={12} /> Mobile View
                      </button>
                    </div>
                  </div>

                  {/* Preview Container Frame */}
                  <div 
                    style={{
                      maxWidth: previewDevice === 'mobile' ? '360px' : '100%',
                      margin: '0 auto',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      border: '2px solid #0f172a',
                      backgroundColor: '#0a2647',
                      position: 'relative',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.18)'
                    }}
                  >
                    <div style={{ position: 'relative', height: previewDevice === 'mobile' ? '220px' : '200px' }}>
                      <img 
                        src={formImage} 
                        alt="Preview" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px', background: 'linear-gradient(180deg, transparent 0%, rgba(10,38,70,0.95) 100%)', color: '#ffffff' }}>
                        <span style={{ fontSize: '0.68rem', color: '#86efac', fontWeight: '800' }}>{formBadge}</span>
                        <h5 style={{ margin: '2px 0', fontSize: '0.9rem', fontWeight: '800' }}>{formTitle || 'Sample Title'}</h5>
                        <p style={{ margin: 0, fontSize: '0.74rem', color: '#cbd5e1' }}>{formSubtitle || 'Sample Subtitle'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Form Input Fields Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#334155', marginBottom: '5px' }}>
                    Banner Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Authorized Wholesale & B2B Distribution"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.86rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#334155', marginBottom: '5px' }}>
                    Badge Tag (Pill Text)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. WHO-GMP CERTIFIED, SPECIAL SCHEME"
                    value={formBadge}
                    onChange={(e) => setFormBadge(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.86rem' }}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#334155', marginBottom: '5px' }}>
                    Subtitle / Description
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Genuine Formulations, Generics & Hospital Consumables Delivered Across Saurashtra"
                    value={formSubtitle}
                    onChange={(e) => setFormSubtitle(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.86rem', resize: 'vertical' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#334155', marginBottom: '5px' }}>
                    Click Target Link
                  </label>
                  <input
                    type="text"
                    placeholder="/quick-order, /products or WhatsApp link"
                    value={formLink}
                    onChange={(e) => setFormLink(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.86rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#334155', marginBottom: '5px' }}>
                    CTA Button Label
                  </label>
                  <input
                    type="text"
                    placeholder="Fast Quick Order ⚡ or WhatsApp Order"
                    value={formCtaText}
                    onChange={(e) => setFormCtaText(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.86rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', color: '#334155', marginBottom: '5px' }}>
                    Display Order #
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formOrder}
                    onChange={(e) => setFormOrder(Number(e.target.value))}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.86rem' }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '24px' }}>
                  <input
                    type="checkbox"
                    id="bannerActiveCheckbox"
                    checked={formActive}
                    onChange={(e) => setFormActive(e.target.checked)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <label htmlFor="bannerActiveCheckbox" style={{ fontSize: '0.86rem', fontWeight: '700', color: '#1e293b', cursor: 'pointer' }}>
                    Active & Displaying on Homepage
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-outline"
                  style={{ padding: '9px 18px', fontSize: '0.86rem' }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{
                    padding: '9px 24px',
                    fontSize: '0.88rem',
                    fontWeight: '800',
                    backgroundColor: '#22c55e',
                    border: 'none',
                    boxShadow: '0 4px 14px rgba(34, 197, 94, 0.4)'
                  }}
                >
                  {editingBanner ? 'Save Changes' : 'Create Banner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
