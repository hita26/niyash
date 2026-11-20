import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  User, 
  Phone, 
  Mail, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  RefreshCw, 
  Eye, 
  Send, 
  Trash2, 
  ExternalLink, 
  ShieldCheck, 
  AlertCircle,
  Download,
  X,
  MessageSquare,
  Lock,
  ChevronDown
} from 'lucide-react';

export default function AdminChemistApprovals({ token, showNotification }) {
  const [chemists, setChemists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All' | 'pending' | 'approved' | 'rejected'

  // Document Preview Modal State
  const [viewingDoc, setViewingDoc] = useState(null); // { title, url, type }

  // Reject Modal State
  const [rejectingChemist, setRejectingChemist] = useState(null);
  const [rejectReason, setRejectReason] = useState('ડ્રગ લાયસન્સ અથવા KYC દસ્તાવેજ સ્પષ્ટ વંચાતો નથી.');
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch all registered chemists
  const fetchChemists = async () => {
    setLoading(true);
    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch('/api/users/chemists', { headers });
      const data = await res.json();
      if (data.success && Array.isArray(data.chemists)) {
        setChemists(data.chemists);
      } else {
        showNotification?.('Could not load chemists list', 'error');
      }
    } catch (err) {
      console.error('Error fetching chemists:', err);
      showNotification?.('Server error loading chemists', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChemists();
  }, []);

  // Handle Approve Chemist
  const handleApprove = async (chemist) => {
    if (!window.confirm(`Are you sure you want to approve "${chemist.companyName || chemist.name}"? This will activate their wholesale login and send an email with their username & password.`)) {
      return;
    }

    setActionLoading(true);
    try {
      const headers = { 
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      };
      const res = await fetch(`/api/users/chemists/${chemist._id}/approve`, {
        method: 'POST',
        headers
      });
      const data = await res.json();

      if (data.success) {
        showNotification?.(data.message || 'Chemist approved and credentials emailed successfully!', 'success');
        // Update local state immediately
        setChemists(prev => prev.map(c => c._id === chemist._id ? { ...c, isApproved: true, status: 'approved', isActive: true, rejectionReason: '' } : c));
      } else {
        showNotification?.(data.message || 'Failed to approve chemist', 'error');
      }
    } catch (err) {
      console.error('Approve error:', err);
      showNotification?.('Server error approving chemist', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Submit Reject
  const handleConfirmReject = async () => {
    if (!rejectingChemist) return;
    setActionLoading(true);
    try {
      const headers = { 
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      };
      const res = await fetch(`/api/users/chemists/${rejectingChemist._id}/reject`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ reason: rejectReason })
      });
      const data = await res.json();

      if (data.success) {
        showNotification?.(data.message || 'Chemist application marked as rejected.', 'warning');
        setChemists(prev => prev.map(c => c._id === rejectingChemist._id ? { ...c, isApproved: false, status: 'rejected', isActive: false, rejectionReason: rejectReason } : c));
        setRejectingChemist(null);
      } else {
        showNotification?.(data.message || 'Failed to reject chemist', 'error');
      }
    } catch (err) {
      console.error('Reject error:', err);
      showNotification?.('Server error rejecting chemist', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Resend Credentials
  const handleResendCredentials = async (chemist) => {
    try {
      const headers = { 
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      };
      const res = await fetch(`/api/users/chemists/${chemist._id}/resend-credentials`, {
        method: 'POST',
        headers
      });
      const data = await res.json();
      if (data.success) {
        showNotification?.(data.message || `Credentials email resent to ${chemist.email}`, 'success');
      } else {
        showNotification?.(data.message || 'Failed to resend credentials', 'error');
      }
    } catch (err) {
      showNotification?.('Error resending credentials', 'error');
    }
  };

  // Handle Delete Chemist
  const handleDeleteChemist = async (chemist) => {
    if (!window.confirm(`Are you sure you want to permanently delete registration for "${chemist.companyName || chemist.name}"?`)) {
      return;
    }

    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(`/api/users/chemists/${chemist._id}`, {
        method: 'DELETE',
        headers
      });
      const data = await res.json();

      if (data.success) {
        showNotification?.('Chemist registration deleted.', 'success');
        setChemists(prev => prev.filter(c => c._id !== chemist._id));
      } else {
        showNotification?.(data.message || 'Failed to delete chemist', 'error');
      }
    } catch (err) {
      showNotification?.('Error deleting chemist', 'error');
    }
  };

  // Helper to open document preview
  const handleOpenDoc = (title, docUrl) => {
    if (!docUrl) {
      showNotification?.('No document uploaded for this field', 'warning');
      return;
    }
    const isPdf = docUrl.includes('application/pdf') || docUrl.endsWith('.pdf');
    setViewingDoc({
      title,
      url: docUrl,
      isPdf
    });
  };

  // Filter chemists
  const filteredChemists = chemists.filter(c => {
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch = !term || 
      (c.companyName && c.companyName.toLowerCase().includes(term)) ||
      (c.name && c.name.toLowerCase().includes(term)) ||
      (c.email && c.email.toLowerCase().includes(term)) ||
      (c.phone && c.phone.includes(term)) ||
      (c.drugLicense && c.drugLicense.toLowerCase().includes(term)) ||
      (c.drugLicense1 && c.drugLicense1.toLowerCase().includes(term)) ||
      (c.gstin && c.gstin.toLowerCase().includes(term)) ||
      (c.pan && c.pan.toLowerCase().includes(term));

    const matchesStatus = statusFilter === 'All' || 
      (statusFilter === 'pending' && (!c.status || c.status === 'pending' || c.isApproved === false && c.status !== 'rejected')) ||
      (statusFilter === 'approved' && (c.status === 'approved' || c.isApproved === true)) ||
      (statusFilter === 'rejected' && c.status === 'rejected');

    return matchesSearch && matchesStatus;
  });

  // KPI Calculations
  const totalCount = chemists.length;
  const pendingCount = chemists.filter(c => !c.status || c.status === 'pending' || (c.isApproved === false && c.status !== 'rejected')).length;
  const approvedCount = chemists.filter(c => c.status === 'approved' || c.isApproved === true).length;
  const rejectedCount = chemists.filter(c => c.status === 'rejected').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      
      {/* Header & KPI Summary */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.65rem', fontWeight: '800', color: 'var(--primary-blue)', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Building2 size={26} color="#0c3d6c" />
            <span>Chemist Registrations & KYC Approvals</span>
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-medium)', margin: 0 }}>
            Review retail pharmacy Drug Licenses (Form 20/21) & KYC documents, grant B2B wholesale portal access, and dispatch login credentials.
          </p>
        </div>

        <button 
          onClick={fetchChemists}
          className="btn btn-outline"
          style={{ padding: '8px 16px', fontSize: '0.86rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          <span>Refresh List</span>
        </button>
      </div>

      {/* KPI Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '14px' }}>
        <div className="card" style={{ padding: '16px 20px', borderLeft: '4px solid #0c3d6c' }}>
          <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Total Chemist Applications</div>
          <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#0c3d6c', marginTop: '4px' }}>{totalCount}</div>
        </div>

        <div className="card" style={{ padding: '16px 20px', borderLeft: '4px solid #f59e0b', backgroundColor: pendingCount > 0 ? '#fffbeb' : undefined }}>
          <div style={{ fontSize: '0.82rem', color: '#b45309', fontWeight: '700', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={16} /> Pending Verification
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#b45309', marginTop: '4px' }}>{pendingCount}</div>
        </div>

        <div className="card" style={{ padding: '16px 20px', borderLeft: '4px solid #10b981' }}>
          <div style={{ fontSize: '0.82rem', color: '#047857', fontWeight: '700', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle2 size={16} /> Approved & Active
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#047857', marginTop: '4px' }}>{approvedCount}</div>
        </div>

        <div className="card" style={{ padding: '16px 20px', borderLeft: '4px solid #ef4444' }}>
          <div style={{ fontSize: '0.82rem', color: '#b91c1c', fontWeight: '700', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <XCircle size={16} /> Rejected / Incomplete
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '900', color: '#b91c1c', marginTop: '4px' }}>{rejectedCount}</div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="card" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ position: 'relative', flex: '1 1 320px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input 
            type="text"
            placeholder="Search by Pharmacy, Chemist Name, Mobile, or Drug License No..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px 10px 38px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '0.9rem'
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '0.86rem', color: '#64748b', fontWeight: '600' }}>Filter Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '9px 14px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '0.88rem',
              fontWeight: '600',
              backgroundColor: '#ffffff'
            }}
          >
            <option value="All">All Registrations ({totalCount})</option>
            <option value="pending">⏳ Pending Verification ({pendingCount})</option>
            <option value="approved">✅ Approved Active ({approvedCount})</option>
            <option value="rejected">❌ Rejected ({rejectedCount})</option>
          </select>
        </div>
      </div>

      {/* Chemist Registrations Roster */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {loading ? (
          <div className="card" style={{ padding: '60px 20px', textAlign: 'center', color: '#64748b' }}>
            <RefreshCw size={28} className="animate-spin" style={{ margin: '0 auto 12px', display: 'block', color: 'var(--primary-blue)' }} />
            Loading chemist KYC registrations...
          </div>
        ) : filteredChemists.length === 0 ? (
          <div className="card" style={{ padding: '50px 20px', textAlign: 'center', color: '#64748b' }}>
            No chemist registrations match your current filter.
          </div>
        ) : (
          filteredChemists.map((c) => {
            const isApproved = c.status === 'approved' || c.isApproved === true;
            const isRejected = c.status === 'rejected';
            const isPending = !isApproved && !isRejected;

            return (
              <div 
                key={c._id} 
                className="card"
                style={{
                  padding: '22px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  borderLeft: isApproved ? '5px solid #10b981' : isRejected ? '5px solid #ef4444' : '5px solid #f59e0b',
                  backgroundColor: isPending ? '#fffdfa' : undefined
                }}
              >
                {/* Row 1: Pharmacy Name, Status Badge, Reg Date & Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px', borderBottom: '1px solid #f1f5f9', paddingBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '10px',
                      backgroundColor: isApproved ? '#dcfce7' : isRejected ? '#fee2e2' : '#fef3c7',
                      color: isApproved ? '#15803d' : isRejected ? '#b91c1c' : '#b45309',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <Building2 size={24} />
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: '#0f172a' }}>
                          {c.companyName || 'Pharmacy Store Name'}
                        </h3>
                        
                        {/* Status Badge */}
                        {isApproved && (
                          <span style={{ fontSize: '0.75rem', backgroundColor: '#dcfce7', color: '#166534', fontWeight: '800', padding: '3px 10px', borderRadius: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <CheckCircle2 size={13} /> APPROVED & ACTIVE
                          </span>
                        )}
                        {isPending && (
                          <span style={{ fontSize: '0.75rem', backgroundColor: '#fef3c7', color: '#92400e', fontWeight: '800', padding: '3px 10px', borderRadius: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={13} /> PENDING VERIFICATION
                          </span>
                        )}
                        {isRejected && (
                          <span style={{ fontSize: '0.75rem', backgroundColor: '#fee2e2', color: '#991b1b', fontWeight: '800', padding: '3px 10px', borderRadius: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <XCircle size={13} /> REJECTED
                          </span>
                        )}
                      </div>

                      <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '4px' }}>
                        Registered on: {new Date(c.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                      </div>
                    </div>
                  </div>

                  {/* Actions Header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    {isPending && (
                      <>
                        <button
                          onClick={() => handleApprove(c)}
                          disabled={actionLoading}
                          className="btn"
                          style={{
                            backgroundColor: '#16a34a',
                            color: '#ffffff',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            fontSize: '0.86rem',
                            fontWeight: '700',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <CheckCircle2 size={16} /> Approve Chemist
                        </button>

                        <button
                          onClick={() => setRejectingChemist(c)}
                          disabled={actionLoading}
                          className="btn"
                          style={{
                            backgroundColor: '#ef4444',
                            color: '#ffffff',
                            padding: '8px 14px',
                            borderRadius: '8px',
                            fontSize: '0.86rem',
                            fontWeight: '700',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <XCircle size={16} /> Reject
                        </button>
                      </>
                    )}

                    {isApproved && (
                      <button
                        onClick={() => handleResendCredentials(c)}
                        className="btn btn-outline"
                        title="Resend email with login username & registered password"
                        style={{ padding: '8px 14px', fontSize: '0.84rem', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                      >
                        <Send size={14} /> Resend Login Email
                      </button>
                    )}

                    {isRejected && (
                      <button
                        onClick={() => handleApprove(c)}
                        disabled={actionLoading}
                        className="btn btn-secondary"
                        style={{ padding: '8px 14px', fontSize: '0.84rem', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                      >
                        <RefreshCw size={14} /> Re-Approve
                      </button>
                    )}

                    <button
                      onClick={() => handleDeleteChemist(c)}
                      className="btn"
                      title="Delete registration"
                      style={{ padding: '8px', color: '#94a3b8', background: 'transparent', border: 'none', cursor: 'pointer' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Row 2: Chemist Contact & Regulatory Details Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', backgroundColor: '#f8fafc', padding: '14px 16px', borderRadius: '10px' }}>
                  {/* Contact Person */}
                  <div>
                    <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', display: 'block' }}>Contact Person</span>
                    <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#1e293b', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <User size={15} color="#0c3d6c" />
                      <span>{c.name}</span>
                    </div>
                  </div>

                  {/* Mobile & Direct WhatsApp */}
                  <div>
                    <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', display: 'block' }}>Phone / WhatsApp</span>
                    <div style={{ fontSize: '0.92rem', fontWeight: '700', color: '#1e293b', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <a href={`tel:${c.phone}`} style={{ color: '#0c3d6c', textDecoration: 'none' }}>+91 {c.phone}</a>
                      <a 
                        href={`https://wa.me/91${c.phone}?text=Hello%20${encodeURIComponent(c.name)}%2C%20regarding%20your%20Niyansh%20Pharma%20chemist%20registration%20for%20${encodeURIComponent(c.companyName)}.`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ color: '#22c55e', display: 'inline-flex', alignItems: 'center' }}
                        title="Chat on WhatsApp"
                      >
                        <MessageSquare size={16} />
                      </a>
                    </div>
                  </div>

                  {/* Registered Email */}
                  <div>
                    <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', display: 'block' }}>Email Address</span>
                    <div style={{ fontSize: '0.88rem', fontWeight: '600', color: '#1e293b', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Mail size={15} color="#64748b" />
                      <a href={`mailto:${c.email}`} style={{ color: '#0369a1', textDecoration: 'none' }}>{c.email}</a>
                    </div>
                  </div>

                  {/* Drug License 1 (Form 20) */}
                  <div>
                    <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', display: 'block' }}>Drug License 1 (Form 20)</span>
                    <div style={{ fontSize: '0.92rem', fontWeight: '800', color: '#047857', marginTop: '2px' }}>
                      {c.drugLicense1 || c.drugLicense || 'N/A'}
                    </div>
                  </div>

                  {/* Drug License 2 (Form 21) */}
                  {c.drugLicense2 && (
                    <div>
                      <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', display: 'block' }}>Drug License 2 (Form 21)</span>
                      <div style={{ fontSize: '0.92rem', fontWeight: '800', color: '#047857', marginTop: '2px' }}>
                        {c.drugLicense2}
                      </div>
                    </div>
                  )}

                  {/* GSTIN / PAN */}
                  <div>
                    <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', display: 'block' }}>Tax Identity (GSTIN / PAN)</span>
                    <div style={{ fontSize: '0.88rem', fontWeight: '700', color: '#334155', marginTop: '2px' }}>
                      {c.gstin ? `GST: ${c.gstin}` : `PAN: ${c.pan || 'N/A'}`}
                    </div>
                  </div>
                </div>

                {/* Rejection notice if rejected */}
                {isRejected && c.rejectionReason && (
                  <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 14px', fontSize: '0.85rem', color: '#991b1b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertCircle size={16} />
                    <span><strong>Rejection Reason:</strong> {c.rejectionReason}</span>
                  </div>
                )}

                {/* Row 3: Uploaded KYC Verification Documents */}
                <div>
                  <span style={{ fontSize: '0.78rem', color: '#475569', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px', display: 'block' }}>
                    Uploaded Regulatory Verification Documents:
                  </span>

                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {/* Drug License 1 Doc */}
                    <button
                      type="button"
                      onClick={() => handleOpenDoc('Drug License Form 20', c.drugLicense1Doc || c.drugLicense)}
                      className="btn card-hover-pharma"
                      style={{
                        padding: '8px 14px',
                        fontSize: '0.82rem',
                        fontWeight: '700',
                        borderRadius: '8px',
                        backgroundColor: c.drugLicense1Doc ? '#eff6ff' : '#f1f5f9',
                        color: c.drugLicense1Doc ? '#1d4ed8' : '#94a3b8',
                        border: '1px solid ' + (c.drugLicense1Doc ? '#93c5fd' : '#cbd5e1'),
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: c.drugLicense1Doc ? 'pointer' : 'not-allowed'
                      }}
                    >
                      <FileText size={15} />
                      <span>📄 Drug License 1 (Form 20)</span>
                    </button>

                    {/* Drug License 2 Doc */}
                    {c.drugLicense2Doc && (
                      <button
                        type="button"
                        onClick={() => handleOpenDoc('Drug License Form 21', c.drugLicense2Doc)}
                        className="btn card-hover-pharma"
                        style={{
                          padding: '8px 14px',
                          fontSize: '0.82rem',
                          fontWeight: '700',
                          borderRadius: '8px',
                          backgroundColor: '#eff6ff',
                          color: '#1d4ed8',
                          border: '1px solid #93c5fd',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <FileText size={15} />
                        <span>📄 Drug License 2 (Form 21)</span>
                      </button>
                    )}

                    {/* GSTIN Certificate */}
                    {c.gstinDoc && (
                      <button
                        type="button"
                        onClick={() => handleOpenDoc('GSTIN Certificate', c.gstinDoc)}
                        className="btn card-hover-pharma"
                        style={{
                          padding: '8px 14px',
                          fontSize: '0.82rem',
                          fontWeight: '700',
                          borderRadius: '8px',
                          backgroundColor: '#f0fdf4',
                          color: '#15803d',
                          border: '1px solid #86efac',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <FileText size={15} />
                        <span>📄 GSTIN Certificate</span>
                      </button>
                    )}

                    {/* PAN Card */}
                    {c.panDoc && (
                      <button
                        type="button"
                        onClick={() => handleOpenDoc('PAN Card Document', c.panDoc)}
                        className="btn card-hover-pharma"
                        style={{
                          padding: '8px 14px',
                          fontSize: '0.82rem',
                          fontWeight: '700',
                          borderRadius: '8px',
                          backgroundColor: '#fefce8',
                          color: '#a16207',
                          border: '1px solid #fde047',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <FileText size={15} />
                        <span>📄 PAN Card</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ============================================================== */}
      {/* MODAL 1: HIGH-RES DOCUMENT VIEWER (Images & PDFs)               */}
      {/* ============================================================== */}
      {viewingDoc && (
        <div 
          onClick={() => setViewingDoc(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.82)',
            backdropFilter: 'blur(8px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="card animate-fade-in"
            style={{
              maxWidth: '850px',
              width: '100%',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 25px 50px rgba(0,0,0,0.3)'
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 22px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
              <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: '800', color: '#0c3d6c', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={20} color="#0c3d6c" />
                <span>{viewingDoc.title}</span>
              </h3>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <a 
                  href={viewingDoc.url} 
                  download={viewingDoc.title.replace(/\s+/g, '_') + (viewingDoc.isPdf ? '.pdf' : '.jpg')}
                  className="btn btn-outline"
                  style={{ padding: '6px 14px', fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <Download size={14} /> Download
                </a>
                <button 
                  onClick={() => setViewingDoc(null)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#64748b' }}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div style={{ padding: '20px', overflowY: 'auto', textAlign: 'center', backgroundColor: '#f1f5f9', minHeight: '360px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {viewingDoc.isPdf ? (
                <iframe 
                  src={viewingDoc.url} 
                  title={viewingDoc.title}
                  style={{ width: '100%', height: '70vh', border: 'none', borderRadius: '8px' }}
                />
              ) : (
                <img 
                  src={viewingDoc.url} 
                  alt={viewingDoc.title}
                  style={{ maxWidth: '100%', maxHeight: '72vh', objectFit: 'contain', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: REJECT CHEMIST VERIFICATION NOTICE                     */}
      {/* ============================================================== */}
      {rejectingChemist && (
        <div 
          onClick={() => setRejectingChemist(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.78)',
            backdropFilter: 'blur(6px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="card animate-fade-in"
            style={{
              maxWidth: '500px',
              width: '100%',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 25px 50px rgba(0,0,0,0.3)'
            }}
          >
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.25rem', color: '#b91c1c', fontWeight: '800' }}>
              Reject Chemist Registration
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#64748b', margin: '0 0 16px 0' }}>
              Store: <strong>{rejectingChemist.companyName}</strong> ({rejectingChemist.email})
            </p>

            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                Reason for Rejection / Re-upload Notice:
              </label>
              <textarea
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.88rem',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setRejectingChemist(null)}
                className="btn btn-outline"
                style={{ padding: '8px 16px' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                disabled={actionLoading}
                className="btn btn-danger"
                style={{ padding: '8px 18px', fontWeight: '700' }}
              >
                {actionLoading ? 'Rejecting...' : 'Confirm Rejection'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
