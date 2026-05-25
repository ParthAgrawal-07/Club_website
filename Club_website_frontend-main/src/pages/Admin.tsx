import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BackgroundCanvas from '@/components/club/BackgroundCanvas';
import Navbar from '@/components/club/Navbar';
import Footer from '@/components/club/Footer';
import { Loader2, Download, Trash2, Calendar, Users, Award, Clipboard, Settings, Edit, Eye, FileText } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

interface EventModel {
  id: number;
  title: string;
  description?: string;
  category: string;
  venue?: string;
  contact_email?: string;
  event_type: string;
  min_team_size?: number | null;
  max_team_size?: number | null;
  event_date: string;
  event_start_date?: string;
  event_end_date?: string;
  start_time?: string;
  end_time?: string;
  registration_start?: string;
  registration_end?: string;
  status?: string;
}

const Admin = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'registrations' | 'createEvent' | 'formBuilder' | 'manageEvents'>('dashboard');

  // Auth & Admin Guard State
  const [authState, setAuthState] = useState<{
    isLoading: boolean;
    isAuthenticated: boolean;
    isAuthorized: boolean;
    user: any;
  }>({
    isLoading: true,
    isAuthenticated: false,
    isAuthorized: false,
    user: null
  });

  // Registration Details inspection state
  const [selectedRegId, setSelectedRegId] = useState<number | null>(null);
  const [selectedRegDetail, setSelectedRegDetail] = useState<any | null>(null);
  const [loadingRegDetail, setLoadingRegDetail] = useState<boolean>(false);

  // Edit Event state
  const [editingEvent, setEditingEvent] = useState<EventModel | null>(null);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    category: 'workshop',
    venue: '',
    contact_email: 'aiclub@daiict.ac.in',
    event_type: 'individual' as 'individual' | 'team',
    min_team_size: 2,
    max_team_size: 4,
    event_start_date: '',
    event_end_date: '',
    start_time: '18:00:00',
    end_time: '21:00:00',
    registration_start: '',
    registration_end: ''
  });
  const [events, setEvents] = useState<EventModel[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<number | ''>('');
  
  // Form Builder state
  const [builderEventId, setBuilderEventId] = useState<number | ''>('');
  const [builderFields, setBuilderFields] = useState<any[]>([]);
  const [loadingFields, setLoadingFields] = useState(false);
  const [newField, setNewField] = useState({
    label: '',
    field_type: 'text',
    placeholder: '',
    required: false,
    options: '', // comma-separated options
    file_max_size_kb: 5120,
    file_allowed_types: 'image/*,application/pdf',
    order_no: 0
  });
  const [fieldMessage, setFieldMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [addingField, setAddingField] = useState(false);

  // Custom Toast and Confirmation Modal states
  const [toast, setToast] = useState<{ isOpen: boolean; message: string; type: 'success' | 'error' | 'info' }>({
    isOpen: false,
    message: '',
    type: 'info'
  });

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ isOpen: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, isOpen: false }));
    }, 4000);
  };

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => Promise<void> | void;
    isDestructive?: boolean;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    isDestructive: false
  });

  const [isConfirming, setIsConfirming] = useState(false);

  const openConfirm = (title: string, message: string, onConfirm: () => Promise<void> | void, isDestructive: boolean = false) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      onConfirm,
      isDestructive
    });
  };
  
  // Dashboard & Metrics State
  const [metrics, setMetrics] = useState<any>(null);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [loadingMetrics, setLoadingMetrics] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [regSearch, setRegSearch] = useState('');


  // Create Event Form State (Matching Backend ClubEvent constraints)
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    category: 'workshop',
    venue: '',
    contact_email: 'aiclub@daiict.ac.in',
    event_type: 'individual' as 'individual' | 'team',
    min_team_size: 2,
    max_team_size: 4,
    event_date: '',
    event_start_date: '',
    event_end_date: '',
    start_time: '18:00:00',
    end_time: '21:00:00',
    registration_start: '',
    registration_end: ''
  });
  const [eventMessage, setEventMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getApiUrl = (path: string) => {
    return `${import.meta.env.PROD ? '' : 'http://localhost:8000'}${path}`;
  };

  const getAuthHeaders = (extra: Record<string, string> = {}) => {
    const headers: Record<string, string> = { ...extra };
    const token = localStorage.getItem('auth_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  };

  // 1. Fetch Events list for selectors
  const fetchEventsList = async () => {
    setLoadingEvents(true);
    try {
      const res = await fetch(getApiUrl('/api/events?limit=100'));
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events || []);
        if (data.events && data.events.length > 0) {
          setSelectedEventId(data.events[0].id);
          setBuilderEventId(data.events[0].id);
        }
      }
    } catch (e) {
      console.error('Failed to load events list', e);
    } finally {
      setLoadingEvents(false);
    }
  };

  // 2. Fetch Dashboard stats (Total, upcoming, completed count)
  const fetchDashboardMetrics = async () => {
    setLoadingMetrics(true);
    try {
      const res = await fetch(getApiUrl('/api/admin/dashboard'), {
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        setMetrics(data);
      }
    } catch (e) {
      console.error('Failed to load dashboard metrics', e);
    } finally {
      setLoadingMetrics(false);
    }
  };

  // 3. Fetch Registrations for a specific Event
  const fetchRegistrations = async (eventId: number | '') => {
    if (!eventId) return;
    setIsLoading(true);
    try {
      // Use search registrations endpoint
      const searchParam = regSearch ? `&search=${encodeURIComponent(regSearch)}` : '';
      const res = await fetch(
        getApiUrl(`/api/admin/events/${eventId}/registrations?limit=100${searchParam}`),
        {
          headers: getAuthHeaders(),
          credentials: 'include'
        }
      );
      if (res.ok) {
        const data = await res.json();
        setRegistrations(data.registrations || []);
      }
    } catch (e) {
      console.error('Failed to fetch registrations', e);
    } finally {
      setIsLoading(false);
    }
  };



  const checkAdminAuth = async () => {
    try {
      const meUrl = `${import.meta.env.PROD ? '' : 'http://localhost:8000'}/api/auth/me`;
      const res = await fetch(meUrl, {
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          const isAdmin = data.user.email === 'meet56963@gmail.com';
          setAuthState({
            isLoading: false,
            isAuthenticated: true,
            isAuthorized: isAdmin,
            user: data.user
          });
          
          if (isAdmin) {
            fetchEventsList();
            fetchDashboardMetrics();
          }
          return;
        }
      }
    } catch (e) {
      console.error('Admin auth check failed:', e);
    }
    
    setAuthState({
      isLoading: false,
      isAuthenticated: false,
      isAuthorized: false,
      user: null
    });
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (!credentialResponse.credential) return;
    setAuthState(prev => ({ ...prev, isLoading: true }));
    try {
      const apiBaseUrl = `${import.meta.env.PROD ? '' : 'http://localhost:8000'}/api/auth/google`;
      const syncRes = await fetch(apiBaseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_token: credentialResponse.credential
        }),
        credentials: 'include'
      });
      if (syncRes.ok) {
        const syncData = await syncRes.json();
        if (syncData.status === 'success' && syncData.user) {
          const isAdmin = syncData.user.email === 'meet56963@gmail.com';
          setAuthState({
            isLoading: false,
            isAuthenticated: true,
            isAuthorized: isAdmin,
            user: syncData.user
          });
          if (isAdmin) {
            fetchEventsList();
            fetchDashboardMetrics();
          } else {
            showToast('Access denied: You are not an administrator.', 'error');
          }
          return;
        }
      }
    } catch (syncErr) {
      console.error('Failed to sync login with PostgreSQL database:', syncErr);
    }
    setAuthState({
      isLoading: false,
      isAuthenticated: false,
      isAuthorized: false,
      user: null
    });
    showToast('Login verification failed. Please try again.', 'error');
  };

  const fetchRegistrationDetail = async (regId: number) => {
    setSelectedRegId(regId);
    setLoadingRegDetail(true);
    try {
      const res = await fetch(getApiUrl(`/api/admin/registrations/${regId}`), { headers: getAuthHeaders(), credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setSelectedRegDetail(data);
      } else {
        showToast('Failed to load registration details.', 'error');
        setSelectedRegId(null);
      }
    } catch (e) {
      console.error('Failed to load registration details', e);
      showToast('Error loading registration details.', 'error');
      setSelectedRegId(null);
    } finally {
      setLoadingRegDetail(false);
    }
  };

  useEffect(() => {
    checkAdminAuth();
  }, []);

  const fetchFormFields = async (eventId: number | '') => {
    if (!eventId) return;
    setLoadingFields(true);
    try {
      const res = await fetch(getApiUrl(`/api/admin/events/${eventId}/form-fields`), {
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        setBuilderFields(data.fields || []);
      } else {
        setBuilderFields([]);
      }
    } catch (e) {
      console.error('Failed to fetch form fields', e);
      setBuilderFields([]);
    } finally {
      setLoadingFields(false);
    }
  };

  const handleAddField = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!builderEventId) return;
    setAddingField(true);
    setFieldMessage(null);

    try {
      const choiceTypes = ['dropdown', 'radio', 'checkbox'];
      const isChoice = choiceTypes.includes(newField.field_type);
      const isFile = newField.field_type === 'file';

      let parsedOptions: string[] | null = null;
      if (isChoice) {
        parsedOptions = newField.options
          .split(',')
          .map(opt => opt.trim())
          .filter(opt => opt.length > 0);
        
        if (parsedOptions.length < 2) {
          throw new Error('Choice fields (dropdown, radio, checkbox) require at least 2 options.');
        }
      }

      const payload = {
        label: newField.label.trim(),
        field_type: newField.field_type,
        placeholder: newField.placeholder.trim() || null,
        required: newField.required,
        options: parsedOptions,
        order_no: Number(newField.order_no),
        file_max_size_kb: isFile ? Number(newField.file_max_size_kb) : null,
        file_allowed_types: isFile ? newField.file_allowed_types.trim() || null : null
      };

      const res = await fetch(getApiUrl(`/api/admin/events/${builderEventId}/form-fields`), {
        method: 'POST',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(payload),
        credentials: 'include'
      });

      const data = await res.json();
      if (!res.ok) {
        const errMsg = Array.isArray(data.detail)
          ? data.detail.map((err: any) => `${err.loc.slice(1).join('.') || 'field'}: ${err.msg}`).join(', ')
          : (typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail));
        throw new Error(errMsg || 'Failed to add form field');
      }

      setFieldMessage({ type: 'success', text: 'Form field added successfully!' });
      
      const nextOrder = builderFields.length > 0 ? Math.max(...builderFields.map(f => f.order_no)) + 10 : 0;
      setNewField({
        label: '',
        field_type: 'text',
        placeholder: '',
        required: false,
        options: '',
        file_max_size_kb: 5120,
        file_allowed_types: 'image/*,application/pdf',
        order_no: nextOrder
      });
      fetchFormFields(builderEventId);
    } catch (err: any) {
      setFieldMessage({ type: 'error', text: err.message || 'Error adding field' });
    } finally {
      setAddingField(false);
    }
  };

  const handleDeleteField = (fieldId: number) => {
    openConfirm(
      'Delete Form Field',
      'Are you sure you want to delete this field? Any user responses already submitted for this field might be affected.',
      async () => {
        try {
          const res = await fetch(getApiUrl(`/api/admin/form-fields/${fieldId}`), {
            method: 'DELETE',
            headers: getAuthHeaders(),
            credentials: 'include'
          });
          if (res.ok) {
            showToast('Field deleted successfully.', 'success');
            fetchFormFields(builderEventId);
          } else {
            const data = await res.json();
            showToast('Deletion failed: ' + (data.detail || 'Server error'), 'error');
          }
        } catch (e: any) {
          showToast('Error: ' + e.message, 'error');
        }
      },
      true
    );
  };

  const handleDeleteEvent = (eventId: number) => {
    openConfirm(
      'Delete Event',
      'Are you sure you want to delete this event? All registrations and form schemas associated with this event will be permanently deleted.',
      async () => {
        try {
          const res = await fetch(getApiUrl(`/api/admin/events/${eventId}`), {
            method: 'DELETE',
            headers: getAuthHeaders(),
            credentials: 'include'
          });
          if (res.ok) {
            showToast('Event deleted successfully.', 'success');
            fetchEventsList();
            fetchDashboardMetrics();
          } else {
            const data = await res.json();
            showToast('Deletion failed: ' + (data.detail || 'Server error'), 'error');
          }
        } catch (e: any) {
          showToast('Error: ' + e.message, 'error');
        }
      },
      true
    );
  };

  const handleStartEdit = (ev: any) => {
    setEditingEvent(ev);
    setEditForm({
      title: ev.title || '',
      description: ev.description || '',
      category: ev.category || 'workshop',
      venue: ev.venue || '',
      contact_email: ev.contact_email || 'aiclub@daiict.ac.in',
      event_type: (ev.event_type || 'individual') as 'individual' | 'team',
      min_team_size: ev.min_team_size || 2,
      max_team_size: ev.max_team_size || 4,
      event_start_date: ev.event_start_date || ev.event_date || '',
      event_end_date: ev.event_end_date || ev.event_date || '',
      start_time: ev.start_time || '18:00:00',
      end_time: ev.end_time || '21:00:00',
      registration_start: ev.registration_start ? new Date(ev.registration_start).toISOString().slice(0, 16) : '',
      registration_end: ev.registration_end ? new Date(ev.registration_end).toISOString().slice(0, 16) : ''
    });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;
    setIsSubmitting(true);
    try {
      const payload = {
        title: editForm.title.trim(),
        description: editForm.description.trim(),
        category: editForm.category,
        venue: editForm.venue.trim(),
        contact_email: editForm.contact_email.trim(),
        event_type: editForm.event_type,
        min_team_size: editForm.event_type === 'team' ? Number(editForm.min_team_size) : null,
        max_team_size: editForm.event_type === 'team' ? Number(editForm.max_team_size) : null,
        event_date: editForm.event_start_date,
        event_start_date: editForm.event_start_date,
        event_end_date: editForm.event_end_date,
        start_time: editForm.start_time.includes(':') && editForm.start_time.split(':').length === 2 ? `${editForm.start_time}:00` : editForm.start_time,
        end_time: editForm.end_time.includes(':') && editForm.end_time.split(':').length === 2 ? `${editForm.end_time}:00` : editForm.end_time,
        registration_start: new Date(editForm.registration_start).toISOString(),
        registration_end: new Date(editForm.registration_end).toISOString()
      };

      const res = await fetch(getApiUrl(`/api/admin/events/${editingEvent.id}`), {
        method: 'PUT',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(payload),
        credentials: 'include'
      });

      const data = await res.json();
      if (!res.ok) {
        const errMsg = Array.isArray(data.detail)
          ? data.detail.map((err: any) => `${err.loc.slice(1).join('.') || 'field'}: ${err.msg}`).join(', ')
          : (typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail));
        throw new Error(errMsg || 'Failed to update event');
      }

      showToast('Event updated successfully!', 'success');
      setEditingEvent(null);
      fetchEventsList();
      fetchDashboardMetrics();
    } catch (err: any) {
      showToast(err.message || 'Error updating event', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'registrations' && selectedEventId) {
      fetchRegistrations(selectedEventId);
    } else if (activeTab === 'dashboard') {
      fetchDashboardMetrics();
    } else if (activeTab === 'formBuilder' && builderEventId) {
      fetchFormFields(builderEventId);
    } else if (activeTab === 'manageEvents') {
      fetchEventsList();
    }
  }, [activeTab, selectedEventId, builderEventId]);

  // Handle Search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRegistrations(selectedEventId);
  };

  // Deletion logic
  const handleDeleteRegistration = (regId: number) => {
    openConfirm(
      'Delete Registration',
      'Are you sure you want to delete this registration? All responses, teams, and files will be permanently deleted.',
      async () => {
        try {
          const res = await fetch(getApiUrl(`/api/admin/registrations/${regId}`), {
            method: 'DELETE',
            headers: getAuthHeaders(),
            credentials: 'include'
          });
          if (res.ok) {
            showToast('Registration deleted successfully.', 'success');
            fetchRegistrations(selectedEventId);
            fetchDashboardMetrics();
          } else {
            const data = await res.json();
            showToast('Deletion failed: ' + (data.detail || 'Server error'), 'error');
          }
        } catch (e: any) {
          showToast('Error: ' + e.message, 'error');
        }
      },
      true
    );
  };

  // Export CSV download
  const handleExportCSV = async () => {
    if (!selectedEventId) return;
    const ev = events.find(e => e.id === selectedEventId);
    const title = ev ? ev.title : `event_${selectedEventId}`;
    try {
      const res = await fetch(getApiUrl(`/api/admin/events/${selectedEventId}/export`), { headers: getAuthHeaders(), credentials: 'include' });
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title.toLowerCase().replace(/\s+/g, '_')}_registrations.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      showToast('CSV exported successfully.', 'success');
    } catch (e: any) {
      showToast('Failed to export CSV: ' + e.message, 'error');
    }
  };

  // Create Event Submit
  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setEventMessage(null);

    try {
      const payload = {
        title: eventForm.title.trim(),
        description: eventForm.description.trim(),
        category: eventForm.category,
        venue: eventForm.venue.trim(),
        contact_email: eventForm.contact_email.trim(),
        event_type: eventForm.event_type,
        min_team_size: eventForm.event_type === 'team' ? Number(eventForm.min_team_size) : null,
        max_team_size: eventForm.event_type === 'team' ? Number(eventForm.max_team_size) : null,
        event_date: eventForm.event_start_date, // base date
        event_start_date: eventForm.event_start_date,
        event_end_date: eventForm.event_end_date,
        start_time: eventForm.start_time.includes(':') && eventForm.start_time.split(':').length === 2 ? `${eventForm.start_time}:00` : eventForm.start_time,
        end_time: eventForm.end_time.includes(':') && eventForm.end_time.split(':').length === 2 ? `${eventForm.end_time}:00` : eventForm.end_time,
        registration_start: new Date(eventForm.registration_start).toISOString(),
        registration_end: new Date(eventForm.registration_end).toISOString()
      };

      const res = await fetch(getApiUrl('/api/admin/events'), {
        method: 'POST',
        headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(payload),
        credentials: 'include'
      });

      const data = await res.json();
      if (!res.ok) {
        const errMsg = Array.isArray(data.detail)
          ? data.detail.map((err: any) => `${err.loc.slice(1).join('.') || 'field'}: ${err.msg}`).join(', ')
          : (typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail));
        throw new Error(errMsg || 'Failed to create event');
      }

      setEventMessage({ type: 'success', text: 'Event created successfully!' });
      setEventForm({
        title: '',
        description: '',
        category: 'workshop',
        venue: '',
        contact_email: 'aiclub@daiict.ac.in',
        event_type: 'individual',
        min_team_size: 2,
        max_team_size: 4,
        event_date: '',
        event_start_date: '',
        event_end_date: '',
        start_time: '18:00:00',
        end_time: '21:00:00',
        registration_start: '',
        registration_end: ''
      });
      fetchEventsList();
      fetchDashboardMetrics();
    } catch (err: any) {
      setEventMessage({ type: 'error', text: err.message || 'Error creating event' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authState.isLoading) {
    return (
      <>
        <BackgroundCanvas />
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm relative z-[1]">
          <Loader2 className="animate-spin text-primary w-12 h-12 mb-4" />
          <p className="text-xs font-mono tracking-widest text-primary uppercase">Verifying Authorization...</p>
        </div>
      </>
    );
  }

  if (!authState.isAuthenticated) {
    return (
      <>
        <BackgroundCanvas />
        <Navbar />
        <div className="min-h-screen flex items-center justify-center px-6 relative z-[1] bg-background">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="glass-card p-8 md:p-12 max-w-md w-full text-center border border-border bg-card/30 backdrop-blur-md"
          >
            <div className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-[10px] font-mono mb-6 bg-primary/10 border border-primary/30 text-primary">
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              RESTRICTED AREA
            </div>
            <h2 className="text-xl md:text-2xl font-bold font-display text-foreground mb-3">Admin Portal</h2>
            <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
              Please authenticate with your administrator account to access event templates, dynamic form configuration, and registrations.
            </p>
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => showToast('Login Failed', 'error')}
                theme="filled_blue"
                size="large"
                shape="rectangular"
              />
            </div>
          </motion.div>
        </div>
      </>
    );
  }

  if (!authState.isAuthorized) {
    return (
      <>
        <BackgroundCanvas />
        <Navbar />
        <div className="min-h-screen flex items-center justify-center px-6 relative z-[1] bg-background">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="glass-card p-8 md:p-12 max-w-md w-full text-center border border-border bg-card/30 backdrop-blur-md"
          >
            <div className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-[10px] font-mono mb-6 bg-destructive/10 border border-destructive/30 text-destructive">
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              ACCESS DENIED
            </div>
            <h2 className="text-xl md:text-2xl font-bold font-display text-foreground mb-3">Unauthorized</h2>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              Your account (<span className="text-primary font-mono">{authState.user.email}</span>) does not have administrative privileges.
            </p>
            <p className="text-xs text-muted-foreground/60 mb-8 leading-relaxed">
              If you believe this is an error, please contact the lead administrator.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="/"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-xs font-bold btn-glow text-primary-foreground transition-all duration-300"
              >
                Go to Homepage
              </a>
            </div>
          </motion.div>
        </div>
      </>
    );
  }

  return (
    <>
      <BackgroundCanvas />
      <Navbar />
      
      <main className="min-h-screen pt-32 pb-24 relative z-[1] max-w-[1200px] mx-auto px-6 md:px-12">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="section-label mb-2">Admin Dashboard</p>
          <h1 className="font-display font-extrabold text-foreground mb-10" style={{ fontSize: 'clamp(32px, 4vw, 48px)' }}>
            Club Management
          </h1>

          {/* Metrics summary cards */}
          {metrics ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
              {[
                { label: 'Total Events', val: metrics.total_events, icon: <Calendar className="text-blue-400" /> },
                { label: 'Total Registrations', val: metrics.total_registrations, icon: <Users className="text-green-400" /> },
                { label: 'Active Events', val: metrics.active_events, icon: <Award className="text-yellow-400" /> },
                { label: 'Upcoming Events', val: metrics.upcoming_events, icon: <Clipboard className="text-pink-400" /> },
                { label: 'Completed Events', val: metrics.completed_events, icon: <Settings className="text-purple-400" /> },
              ].map((card, i) => (
                <div key={i} className="glass-card p-4 rounded-xl border border-border flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-muted-foreground tracking-wider uppercase font-mono">{card.label}</span>
                    <h3 className="font-display font-bold text-2xl text-foreground mt-1">{card.val}</h3>
                  </div>
                  <div className="p-2 rounded-lg bg-secondary">{card.icon}</div>
                </div>
              ))}
            </div>
          ) : (
            loadingMetrics && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="glass-card p-4 rounded-xl border border-border flex items-center justify-between gap-2 animate-pulse">
                    <div className="space-y-2">
                      <div className="h-3 w-20 bg-secondary rounded"></div>
                      <div className="h-6 w-12 bg-secondary rounded mt-1"></div>
                    </div>
                    <div className="p-4 rounded-lg bg-secondary/80 h-10 w-10"></div>
                  </div>
                ))}
              </div>
            )
          )}

          {/* Tabs */}
          <div className="flex gap-2 border-b border-border mb-8 overflow-x-auto">
            {['dashboard', 'registrations', 'createEvent', 'formBuilder', 'manageEvents'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`relative px-5 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab === 'dashboard' ? 'Overview' : tab === 'registrations' ? 'Event Registrations' : tab === 'createEvent' ? 'Create Event' : tab === 'formBuilder' ? 'Form Builder' : 'Manage Events'}
                {activeTab === tab && (
                  <motion.div
                    layoutId="admin-tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Content panel */}
          <div className="glass-card p-6 md:p-8 rounded-2xl border border-border bg-card/40 backdrop-blur-md">
            <AnimatePresence mode="wait">
              
              {/* OVERVIEW TAB */}
              {activeTab === 'dashboard' && (
                <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <h2 className="text-xl font-bold font-display mb-6">Recent Activity</h2>
                  {loadingMetrics ? (
                    <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" /></div>
                  ) : !metrics || metrics.recent_registrations.length === 0 ? (
                    <p className="text-muted-foreground text-center py-12">No recent registrations found.</p>
                  ) : (
                    <div className="space-y-4">
                      {metrics.recent_registrations.map((reg: any) => (
                        <div key={reg.id} className="flex justify-between items-center bg-secondary/30 p-4 rounded-xl border border-border/50">
                          <div>
                            <p className="text-sm font-semibold text-foreground">{reg.user_name}</p>
                            <p className="text-xs text-muted-foreground">{reg.user_email} • Registered for <span className="text-primary font-medium">{reg.event_title}</span></p>
                          </div>
                          <span className="text-xs text-muted-foreground font-mono">{new Date(reg.registered_at).toLocaleDateString()}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* REGISTRATIONS TAB */}
              {activeTab === 'registrations' && (
                <motion.div key="reg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <h2 className="text-xl font-bold font-display">Registrations</h2>
                    
                    {/* Event Selector and Search form */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <select
                        value={selectedEventId}
                        onChange={(e) => setSelectedEventId(Number(e.target.value))}
                        className="bg-secondary border border-border rounded-lg px-3 py-2 text-xs text-foreground outline-none"
                      >
                        <option value="" disabled>Select Event...</option>
                        {events.map(ev => (
                          <option key={ev.id} value={ev.id}>{ev.title}</option>
                        ))}
                      </select>

                      <form onSubmit={handleSearchSubmit} className="flex gap-2">
                        <input
                          type="text"
                          value={regSearch}
                          onChange={(e) => setRegSearch(e.target.value)}
                          placeholder="Search registrations..."
                          className="bg-secondary border border-border rounded-lg px-3 py-1.5 text-xs text-foreground outline-none w-44"
                        />
                        <button type="submit" className="px-3 py-1.5 bg-primary text-primary-foreground text-xs font-semibold rounded-lg">Search</button>
                      </form>

                      {selectedEventId && (
                        <button
                          onClick={handleExportCSV}
                          className="flex items-center gap-1 px-3 py-1.5 bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold rounded-lg hover:bg-green-500 hover:text-white transition-all"
                        >
                          <Download size={14} />
                          Export CSV
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {isLoading ? (
                    <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" /></div>
                  ) : registrations.length === 0 ? (
                    <p className="text-muted-foreground text-center py-12">No registrations found for this event.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-border text-muted-foreground text-xs uppercase tracking-wider">
                            <th className="p-3 font-medium">Date</th>
                            <th className="p-3 font-medium">Name</th>
                            <th className="p-3 font-medium">Email</th>
                            <th className="p-3 font-medium">Team Name</th>
                            <th className="p-3 font-medium text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="text-sm">
                          {registrations.map((reg) => (
                            <tr key={reg.id} className="border-b border-border/50 hover:bg-white/5 transition-colors">
                              <td className="p-3 whitespace-nowrap">{new Date(reg.registered_at).toLocaleDateString()}</td>
                              <td className="p-3 font-medium">{reg.user_name}</td>
                              <td className="p-3">{reg.user_email}</td>
                              <td className="p-3 font-mono">{reg.team_name || 'Individual'}</td>
                              <td className="p-3 text-right">
                                <button
                                  onClick={() => fetchRegistrationDetail(reg.id)}
                                  className="p-1.5 text-muted-foreground hover:text-primary rounded-lg hover:bg-primary/10 transition-colors mr-1.5"
                                  title="View Details"
                                >
                                  <Eye size={14} />
                                </button>
                                <button
                                  onClick={() => handleDeleteRegistration(reg.id)}
                                  className="p-1.5 text-muted-foreground hover:text-destructive rounded-lg hover:bg-destructive/10 transition-colors"
                                  title="Delete Registration"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </motion.div>
              )}



              {/* CREATE EVENT TAB */}
              {activeTab === 'createEvent' && (
                <motion.div key="create" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-2xl mx-auto">
                  <h2 className="text-xl font-bold font-display mb-6">Create New Event</h2>
                  
                  {eventMessage && (
                    <div className={`p-4 rounded-lg mb-6 text-sm ${eventMessage.type === 'success' ? 'bg-green-500/10 border border-green-500/20 text-green-500' : 'bg-red-500/10 border border-red-500/20 text-red-500'}`}>
                      {eventMessage.text}
                    </div>
                  )}

                  <form onSubmit={handleCreateEvent} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-mono tracking-wider text-muted-foreground uppercase mb-1">Event Title</label>
                        <input
                          type="text"
                          required
                          value={eventForm.title}
                          onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
                          className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary transition-colors"
                          placeholder="e.g. Kaggle ML Cup 2026"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono tracking-wider text-muted-foreground uppercase mb-1">Category</label>
                        <select
                          value={eventForm.category}
                          onChange={(e) => setEventForm({...eventForm, category: e.target.value})}
                          className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary transition-colors"
                        >
                          <option value="competition">Competition</option>
                          <option value="hackathon">Hackathon</option>
                          <option value="workshop">Workshop</option>
                          <option value="talk">Guest Lecture / Talk</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-mono tracking-wider text-muted-foreground uppercase mb-1">Venue / Online Link</label>
                        <input
                          type="text"
                          required
                          value={eventForm.venue}
                          onChange={(e) => setEventForm({...eventForm, venue: e.target.value})}
                          className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary transition-colors"
                          placeholder="e.g. Lab 102 or MS Teams URL"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono tracking-wider text-muted-foreground uppercase mb-1">Contact Email</label>
                        <input
                          type="email"
                          required
                          value={eventForm.contact_email}
                          onChange={(e) => setEventForm({...eventForm, contact_email: e.target.value})}
                          className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div>
                        <label className="block text-xs font-mono tracking-wider text-muted-foreground uppercase mb-1">Event Type</label>
                        <select
                          value={eventForm.event_type}
                          onChange={(e) => setEventForm({...eventForm, event_type: e.target.value as any})}
                          className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary transition-colors"
                        >
                          <option value="individual">Individual</option>
                          <option value="team">Team</option>
                        </select>
                      </div>
                      
                      {eventForm.event_type === 'team' && (
                        <>
                          <div>
                            <label className="block text-xs font-mono tracking-wider text-muted-foreground uppercase mb-1">Min Team Size</label>
                            <input
                              type="number"
                              min={2}
                              value={eventForm.min_team_size}
                              onChange={(e) => setEventForm({...eventForm, min_team_size: Number(e.target.value)})}
                              className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-mono tracking-wider text-muted-foreground uppercase mb-1">Max Team Size</label>
                            <input
                              type="number"
                              min={eventForm.min_team_size}
                              value={eventForm.max_team_size}
                              onChange={(e) => setEventForm({...eventForm, max_team_size: Number(e.target.value)})}
                              className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary transition-colors"
                            />
                          </div>
                        </>
                      )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                      <div>
                        <label className="block text-xs font-mono tracking-wider text-muted-foreground uppercase mb-1">Event Start Date</label>
                        <input
                          type="date"
                          required
                          value={eventForm.event_start_date}
                          onChange={(e) => setEventForm({...eventForm, event_start_date: e.target.value})}
                          className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono tracking-wider text-muted-foreground uppercase mb-1">Event End Date</label>
                        <input
                          type="date"
                          required
                          value={eventForm.event_end_date}
                          onChange={(e) => setEventForm({...eventForm, event_end_date: e.target.value})}
                          className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono tracking-wider text-muted-foreground uppercase mb-1">Start Time</label>
                        <input
                          type="time"
                          required
                          value={eventForm.start_time}
                          onChange={(e) => setEventForm({...eventForm, start_time: e.target.value})}
                          className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono tracking-wider text-muted-foreground uppercase mb-1">End Time</label>
                        <input
                          type="time"
                          required
                          value={eventForm.end_time}
                          onChange={(e) => setEventForm({...eventForm, end_time: e.target.value})}
                          className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-mono tracking-wider text-muted-foreground uppercase mb-1">Registration Start Date</label>
                        <input
                          type="datetime-local"
                          required
                          value={eventForm.registration_start}
                          onChange={(e) => setEventForm({...eventForm, registration_start: e.target.value})}
                          className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono tracking-wider text-muted-foreground uppercase mb-1">Registration End Date</label>
                        <input
                          type="datetime-local"
                          required
                          value={eventForm.registration_end}
                          onChange={(e) => setEventForm({...eventForm, registration_end: e.target.value})}
                          className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono tracking-wider text-muted-foreground uppercase mb-1">Description</label>
                      <textarea
                        required
                        value={eventForm.description}
                        onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                        rows={4}
                        className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary transition-colors resize-none"
                        placeholder="Comprehensive event description..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 mt-4 text-sm font-bold rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 transition-all duration-300 disabled:opacity-50 flex justify-center items-center gap-2"
                    >
                      {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                      {isSubmitting ? 'Creating Event...' : 'Create Event'}
                    </button>
                  </form>
                </motion.div>
              )}

              {/* FORM BUILDER TAB */}
              {activeTab === 'formBuilder' && (
                <motion.div key="formBuilder" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                      <h2 className="text-xl font-bold font-display text-foreground">Registration Form Builder</h2>
                      <p className="text-xs text-muted-foreground mt-1">Configure dynamic registration fields for each event.</p>
                    </div>
                    
                    {/* Event Selector */}
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-muted-foreground uppercase">Select Event:</span>
                      <select
                        value={builderEventId}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setBuilderEventId(val);
                        }}
                        className="bg-secondary border border-border rounded-lg px-3 py-2 text-xs text-foreground outline-none focus:border-primary transition-colors"
                      >
                        <option value="" disabled>Select Event...</option>
                        {events.map(ev => (
                          <option key={ev.id} value={ev.id}>{ev.title}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {!builderEventId ? (
                    <p className="text-muted-foreground text-center py-12">Please select an event from the dropdown to start building its form.</p>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                      {/* Left: Existing Fields list (7 cols) */}
                      <div className="lg:col-span-7 space-y-4">
                        <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider font-mono">Current Form Fields</h3>
                        
                        {loadingFields ? (
                          <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" /></div>
                        ) : builderFields.length === 0 ? (
                          <div className="text-center p-8 rounded-xl border border-border border-dashed bg-secondary/10">
                            <p className="text-xs text-muted-foreground">No custom fields have been added yet.</p>
                            <p className="text-[10px] text-muted-foreground/80 mt-1">The public registration form will default to requiring no additional fields.</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {builderFields.map((field) => (
                              <div key={field.id} className="flex justify-between items-start bg-secondary/20 p-4 rounded-xl border border-border/60 hover:border-border transition-colors">
                                <div className="space-y-1.5">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-sm font-semibold text-foreground">{field.label}</span>
                                    {field.required && (
                                      <span className="text-[9px] font-mono bg-destructive/10 text-destructive border border-destructive/20 px-1.5 py-0.5 rounded">Required</span>
                                    )}
                                    <span className="text-[9px] font-mono bg-primary/10 text-primary border border-primary/20 px-1.5 py-0.5 rounded uppercase">{field.field_type}</span>
                                  </div>
                                  
                                  {field.placeholder && (
                                    <p className="text-xs text-muted-foreground"><span className="text-muted-foreground/60 font-mono">Placeholder:</span> "{field.placeholder}"</p>
                                  )}
                                  
                                  {field.options_json && (
                                    <div className="flex gap-1.5 flex-wrap items-center">
                                      <span className="text-[10px] text-muted-foreground/60 font-mono">Options:</span>
                                      {JSON.parse(field.options_json).map((opt: string) => (
                                        <span key={opt} className="text-[10px] bg-secondary px-2 py-0.5 rounded text-foreground border border-border/30">{opt}</span>
                                      ))}
                                    </div>
                                  )}

                                  {field.field_type === 'file' && (
                                    <p className="text-[10px] text-muted-foreground">
                                      <span className="font-mono">Max size:</span> {((field.file_max_size_kb || 5120) / 1024).toFixed(1)} MB 
                                      {field.file_allowed_types && ` • Allowed: ${field.file_allowed_types}`}
                                    </p>
                                  )}
                                  
                                  <div className="text-[10px] text-muted-foreground/50 font-mono">Order: {field.order_no}</div>
                                </div>
                                
                                <button
                                  onClick={() => handleDeleteField(field.id)}
                                  className="p-1.5 text-muted-foreground hover:text-destructive rounded-lg hover:bg-destructive/10 transition-colors"
                                  title="Delete Field"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Right: Add New Field form (5 cols) */}
                      <div className="lg:col-span-5 bg-secondary/15 p-6 rounded-xl border border-border/80 h-fit">
                        <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider font-mono mb-4">Add Field</h3>
                        
                        {fieldMessage && (
                          <div className={`p-3 rounded-lg mb-4 text-xs ${fieldMessage.type === 'success' ? 'bg-green-500/10 border border-green-500/20 text-green-500' : 'bg-red-500/10 border border-red-500/20 text-red-500'}`}>
                            {fieldMessage.text}
                          </div>
                        )}

                        <form onSubmit={handleAddField} className="space-y-4">
                          <div>
                            <label className="block text-[10px] font-mono tracking-wider text-muted-foreground uppercase mb-1">Field Label *</label>
                            <input
                              type="text"
                              required
                              value={newField.label}
                              onChange={(e) => setNewField({...newField, label: e.target.value})}
                              className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-xs text-foreground outline-none focus:border-primary transition-colors"
                              placeholder="e.g. GitHub URL or Branch"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] font-mono tracking-wider text-muted-foreground uppercase mb-1">Field Type</label>
                              <select
                                value={newField.field_type}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setNewField({
                                    ...newField, 
                                    field_type: val,
                                    order_no: newField.order_no || (builderFields.length > 0 ? Math.max(...builderFields.map(f => f.order_no)) + 10 : 0)
                                  });
                                }}
                                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-xs text-foreground outline-none focus:border-primary transition-colors"
                              >
                                <option value="text">Text Input</option>
                                <option value="number">Number</option>
                                <option value="email">Email</option>
                                <option value="phone">Phone / Mobile</option>
                                <option value="textarea">Text Area</option>
                                <option value="date">Date</option>
                                <option value="dropdown">Dropdown Select</option>
                                <option value="radio">Radio Buttons</option>
                                <option value="checkbox">Checkboxes</option>
                                <option value="file">File Upload</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-[10px] font-mono tracking-wider text-muted-foreground uppercase mb-1">Order Number</label>
                              <input
                                type="number"
                                required
                                value={newField.order_no}
                                onChange={(e) => setNewField({...newField, order_no: Number(e.target.value)})}
                                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-xs text-foreground outline-none focus:border-primary transition-colors"
                                placeholder="0, 10, 20..."
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] font-mono tracking-wider text-muted-foreground uppercase mb-1">Placeholder Text</label>
                            <input
                              type="text"
                              value={newField.placeholder}
                              onChange={(e) => setNewField({...newField, placeholder: e.target.value})}
                              className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-xs text-foreground outline-none focus:border-primary transition-colors"
                              placeholder="e.g. Enter your roll number"
                            />
                          </div>

                          {/* CHOICE TYPES: options selection */}
                          {['dropdown', 'radio', 'checkbox'].includes(newField.field_type) && (
                            <div>
                              <label className="block text-[10px] font-mono tracking-wider text-muted-foreground uppercase mb-1">Choices * (comma-separated)</label>
                              <textarea
                                required
                                value={newField.options}
                                onChange={(e) => setNewField({...newField, options: e.target.value})}
                                rows={2}
                                className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-xs text-foreground outline-none focus:border-primary transition-colors resize-none"
                                placeholder="e.g. CSE, ECE, ICT"
                              />
                            </div>
                          )}

                          {/* FILE TYPE: file configuration */}
                          {newField.field_type === 'file' && (
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[10px] font-mono tracking-wider text-muted-foreground uppercase mb-1">Max Size (KB)</label>
                                <input
                                  type="number"
                                  value={newField.file_max_size_kb}
                                  onChange={(e) => setNewField({...newField, file_max_size_kb: Number(e.target.value)})}
                                  className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-xs text-foreground outline-none focus:border-primary transition-colors"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-mono tracking-wider text-muted-foreground uppercase mb-1">Allowed Mimes</label>
                                <input
                                  type="text"
                                  value={newField.file_allowed_types}
                                  onChange={(e) => setNewField({...newField, file_allowed_types: e.target.value})}
                                  className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-xs text-foreground outline-none focus:border-primary transition-colors"
                                  placeholder="e.g. image/*,application/pdf"
                                />
                              </div>
                            </div>
                          )}

                          <label className="flex items-center gap-2 cursor-pointer pt-1">
                            <input
                              type="checkbox"
                              checked={newField.required}
                              onChange={(e) => setNewField({...newField, required: e.target.checked})}
                              className="rounded bg-secondary border border-border outline-none focus:ring-primary text-primary w-4 h-4"
                            />
                            <span className="text-xs text-foreground font-medium select-none">Require users to fill this field</span>
                          </label>

                          <button
                            type="submit"
                            disabled={addingField}
                            className="w-full py-2 bg-primary text-primary-foreground text-xs font-bold rounded-lg hover:bg-primary/95 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                          >
                            {addingField && <Loader2 size={12} className="animate-spin" />}
                            {addingField ? 'Adding Field...' : 'Add Field'}
                          </button>
                        </form>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* MANAGE EVENTS TAB */}
              {activeTab === 'manageEvents' && (
                <motion.div key="manageEvents" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold font-display text-foreground">Manage Events</h2>
                    <button onClick={fetchEventsList} className="text-xs text-primary hover:underline">Refresh List</button>
                  </div>

                  {loadingEvents ? (
                    <div className="flex justify-center py-12"><Loader2 className="animate-spin text-primary" size={32} /></div>
                  ) : events.length === 0 ? (
                    <p className="text-muted-foreground text-center py-12">No events found. You can create one in the "Create Event" tab.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-border text-muted-foreground text-xs uppercase tracking-wider">
                            <th className="p-3 font-medium">Event Title</th>
                            <th className="p-3 font-medium">Dates</th>
                            <th className="p-3 font-medium">Venue</th>
                            <th className="p-3 font-medium">Type</th>
                            <th className="p-3 font-medium">Category</th>
                            <th className="p-3 font-medium text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="text-sm">
                          {events.map((ev: any) => (
                            <tr key={ev.id} className="border-b border-border/50 hover:bg-white/5 transition-colors">
                              <td className="p-3 font-medium text-foreground">{ev.title}</td>
                              <td className="p-3 whitespace-nowrap text-muted-foreground text-xs">
                                {ev.event_start_date && ev.event_end_date && ev.event_start_date !== ev.event_end_date
                                  ? `${ev.event_start_date} to ${ev.event_end_date}`
                                  : ev.event_start_date || ev.event_date}
                              </td>
                              <td className="p-3 text-muted-foreground max-w-[150px] truncate" title={ev.venue}>{ev.venue || 'N/A'}</td>
                              <td className="p-3 capitalize text-xs text-muted-foreground">{ev.event_type}</td>
                              <td className="p-3"><span className="bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded text-xs uppercase">{ev.category}</span></td>
                              <td className="p-3 text-right space-x-2">
                                <button
                                  onClick={() => handleStartEdit(ev)}
                                  className="p-1.5 text-muted-foreground hover:text-primary rounded-lg hover:bg-primary/10 transition-colors inline-flex items-center"
                                  title="Edit Event"
                                >
                                  <Edit size={14} />
                                </button>
                                <button
                                  onClick={() => handleDeleteEvent(ev.id)}
                                  className="p-1.5 text-muted-foreground hover:text-destructive rounded-lg hover:bg-destructive/10 transition-colors inline-flex items-center"
                                  title="Delete Event"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </main>

      <Footer />

      {/* Toast Notification */}
      <AnimatePresence>
        {toast.isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl backdrop-blur-md max-w-sm ${
              toast.type === 'success'
                ? 'bg-accent/15 border-accent/30 text-accent'
                : toast.type === 'error'
                ? 'bg-destructive/15 border-destructive/30 text-destructive'
                : 'bg-primary/15 border-primary/30 text-primary'
            }`}
          >
            <span className="text-xs font-medium">{toast.message}</span>
            <button
              onClick={() => setToast(prev => ({ ...prev, isOpen: false }))}
              className="text-muted-foreground hover:text-foreground text-xs ml-2"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Confirmation Modal */}
      <AnimatePresence>
        {confirmModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            />
            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md rounded-2xl bg-card border border-border p-6 shadow-2xl z-10"
              style={{ background: 'linear-gradient(135deg, hsl(217 91% 60% / 0.04), hsl(217 91% 60% / 0.01))' }}
            >
              <h3 className="font-display font-extrabold text-foreground text-lg mb-2">
                {confirmModal.title}
              </h3>
              <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
                {confirmModal.message}
              </p>
              
              <div className="flex justify-end gap-3">
                <button
                  disabled={isConfirming}
                  onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-secondary text-foreground hover:bg-secondary/80 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  disabled={isConfirming}
                  onClick={async () => {
                    setIsConfirming(true);
                    try {
                      await confirmModal.onConfirm();
                    } finally {
                      setIsConfirming(false);
                      setConfirmModal(prev => ({ ...prev, isOpen: false }));
                    }
                  }}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg text-white transition-all flex items-center justify-center gap-1.5 min-w-[80px] disabled:opacity-50 ${
                    confirmModal.isDestructive
                      ? 'bg-destructive hover:bg-destructive/90'
                      : 'bg-primary hover:bg-primary/90'
                  }`}
                >
                  {isConfirming && <Loader2 size={12} className="animate-spin" />}
                  {isConfirming ? 'Processing...' : 'Confirm'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Event Modal Overlay */}
      <AnimatePresence>
        {editingEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingEvent(null)}
              className="fixed inset-0 bg-background/80 backdrop-blur-md"
            />

            {/* Form Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="relative w-full max-w-2xl rounded-2xl bg-card border border-border p-6 shadow-2xl overflow-y-auto max-h-[90vh] z-10"
              style={{ background: 'linear-gradient(135deg, hsl(217 91% 60% / 0.05), hsl(217 91% 60% / 0.02))' }}
            >
              {/* Close Button */}
              <button
                onClick={() => setEditingEvent(null)}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                ✕
              </button>

              <h3 className="font-display font-extrabold text-foreground text-xl mb-1">Edit Event</h3>
              <p className="text-xs text-muted-foreground mb-6">Modifying event details for: <span className="text-primary font-semibold">{editingEvent.title}</span></p>

              <form onSubmit={handleSaveEdit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-mono tracking-wider text-muted-foreground uppercase mb-1">Event Title</label>
                    <input
                      type="text"
                      required
                      value={editForm.title}
                      onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                      className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono tracking-wider text-muted-foreground uppercase mb-1">Category</label>
                    <select
                      value={editForm.category}
                      onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                      className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary transition-colors"
                    >
                      <option value="competition">Competition</option>
                      <option value="hackathon">Hackathon</option>
                      <option value="workshop">Workshop</option>
                      <option value="talk">Guest Lecture / Talk</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-mono tracking-wider text-muted-foreground uppercase mb-1">Venue / Online Link</label>
                    <input
                      type="text"
                      required
                      value={editForm.venue}
                      onChange={(e) => setEditForm({...editForm, venue: e.target.value})}
                      className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono tracking-wider text-muted-foreground uppercase mb-1">Contact Email</label>
                    <input
                      type="email"
                      required
                      value={editForm.contact_email}
                      onChange={(e) => setEditForm({...editForm, contact_email: e.target.value})}
                      className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-xs font-mono tracking-wider text-muted-foreground uppercase mb-1">Event Type</label>
                    <select
                      value={editForm.event_type}
                      onChange={(e) => setEditForm({...editForm, event_type: e.target.value as any})}
                      className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary transition-colors"
                    >
                      <option value="individual">Individual</option>
                      <option value="team">Team</option>
                    </select>
                  </div>
                  
                  {editForm.event_type === 'team' && (
                    <>
                      <div>
                        <label className="block text-xs font-mono tracking-wider text-muted-foreground uppercase mb-1">Min Team Size</label>
                        <input
                          type="number"
                          min={2}
                          value={editForm.min_team_size}
                          onChange={(e) => setEditForm({...editForm, min_team_size: Number(e.target.value)})}
                          className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-mono tracking-wider text-muted-foreground uppercase mb-1">Max Team Size</label>
                        <input
                          type="number"
                          min={editForm.min_team_size}
                          value={editForm.max_team_size}
                          onChange={(e) => setEditForm({...editForm, max_team_size: Number(e.target.value)})}
                          className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary transition-colors"
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                  <div>
                    <label className="block text-xs font-mono tracking-wider text-muted-foreground uppercase mb-1">Event Start Date</label>
                    <input
                      type="date"
                      required
                      value={editForm.event_start_date}
                      onChange={(e) => setEditForm({...editForm, event_start_date: e.target.value})}
                      className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono tracking-wider text-muted-foreground uppercase mb-1">Event End Date</label>
                    <input
                      type="date"
                      required
                      value={editForm.event_end_date}
                      onChange={(e) => setEditForm({...editForm, event_end_date: e.target.value})}
                      className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono tracking-wider text-muted-foreground uppercase mb-1">Start Time</label>
                    <input
                      type="time"
                      required
                      value={editForm.start_time}
                      onChange={(e) => setEditForm({...editForm, start_time: e.target.value})}
                      className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono tracking-wider text-muted-foreground uppercase mb-1">End Time</label>
                    <input
                      type="time"
                      required
                      value={editForm.end_time}
                      onChange={(e) => setEditForm({...editForm, end_time: e.target.value})}
                      className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-mono tracking-wider text-muted-foreground uppercase mb-1">Registration Start Date</label>
                    <input
                      type="datetime-local"
                      required
                      value={editForm.registration_start}
                      onChange={(e) => setEditForm({...editForm, registration_start: e.target.value})}
                      className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono tracking-wider text-muted-foreground uppercase mb-1">Registration End Date</label>
                    <input
                      type="datetime-local"
                      required
                      value={editForm.registration_end}
                      onChange={(e) => setEditForm({...editForm, registration_end: e.target.value})}
                      className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono tracking-wider text-muted-foreground uppercase mb-1">Description</label>
                  <textarea
                    required
                    value={editForm.description}
                    onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                    rows={4}
                    className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 mt-4 text-sm font-bold rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 transition-all duration-300 disabled:opacity-50 flex justify-center items-center gap-2"
                >
                  {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                  {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Registration Details Modal */}
      <AnimatePresence>
        {selectedRegId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setSelectedRegId(null); setSelectedRegDetail(null); }}
              className="fixed inset-0 bg-background/80 backdrop-blur-md"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="relative w-full max-w-2xl rounded-2xl bg-card border border-border p-6 md:p-8 shadow-2xl overflow-y-auto max-h-[90vh] z-10"
              style={{ background: 'linear-gradient(135deg, hsl(217 91% 60% / 0.05), hsl(217 91% 60% / 0.02))' }}
            >
              {/* Close Button */}
              <button
                onClick={() => { setSelectedRegId(null); setSelectedRegDetail(null); }}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              >
                ✕
              </button>

              <h3 className="font-display font-extrabold text-foreground text-xl mb-1">Registration Details</h3>
              <p className="text-xs text-muted-foreground mb-6">Inspecting registration ID: <span className="text-primary font-mono">{selectedRegId}</span></p>

              {loadingRegDetail ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <Loader2 className="animate-spin text-primary w-8 h-8" />
                  <span className="text-xs text-muted-foreground font-mono">Fetching data...</span>
                </div>
              ) : selectedRegDetail ? (
                <div className="space-y-6">
                  {/* User profile metadata */}
                  <div className="flex items-center gap-4 bg-secondary/30 p-4 rounded-xl border border-border/50">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center font-display text-lg font-extrabold text-primary border border-primary/20">
                      {selectedRegDetail.user_name ? selectedRegDetail.user_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground text-sm leading-snug">{selectedRegDetail.user_name}</h4>
                      <p className="text-xs text-muted-foreground leading-normal">{selectedRegDetail.user_email}</p>
                      <p className="text-[10px] text-muted-foreground/60 mt-1">Registered at: {new Date(selectedRegDetail.registered_at).toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Event & Team Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-secondary/20 border border-border/40">
                      <span className="text-[10px] text-muted-foreground uppercase font-mono tracking-wider">Event Details</span>
                      <h5 className="font-display font-bold text-sm text-foreground mt-1.5">{selectedRegDetail.event_title}</h5>
                      <span className="inline-block text-[9px] font-mono bg-primary/10 border border-primary/20 text-primary px-2 py-0.5 rounded mt-2">
                        {selectedRegDetail.team_name ? 'Team Event' : 'Individual Event'}
                      </span>
                    </div>

                    {selectedRegDetail.team_name && (
                      <div className="p-4 rounded-xl bg-secondary/20 border border-border/40">
                        <span className="text-[10px] text-muted-foreground uppercase font-mono tracking-wider">Team Information</span>
                        <h5 className="font-display font-bold text-sm text-foreground mt-1.5">Team: {selectedRegDetail.team_name}</h5>
                        <p className="text-xs text-primary font-semibold mt-1">Leader: {selectedRegDetail.user_name}</p>
                      </div>
                    )}
                  </div>

                  {/* Team Members List (If applicable) */}
                  {selectedRegDetail.team && selectedRegDetail.team.members && selectedRegDetail.team.members.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider font-mono">Team Members</h4>
                      <div className="space-y-1.5">
                        {selectedRegDetail.team.members.map((member: any) => (
                          <div key={member.id} className="flex justify-between items-center bg-secondary/15 p-2 px-3 rounded-lg border border-border/30 text-xs">
                            <span className="font-medium text-foreground">{member.member_name}</span>
                            <span className="text-muted-foreground font-mono text-[11px]">{member.member_email}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Custom Form Fields Responses */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider font-mono">Form Responses</h4>
                    
                    {Object.keys(selectedRegDetail.responses_flat || {}).length === 0 ? (
                      <p className="text-xs text-muted-foreground italic">No custom fields were configured for this event.</p>
                    ) : (
                      <div className="space-y-3">
                        {Object.entries(selectedRegDetail.responses_flat).map(([label, val]: [string, any]) => {
                          const isUpload = selectedRegDetail.uploaded_files && selectedRegDetail.uploaded_files.some((f: any) => f.field_label === label);
                          return (
                            <div key={label} className="bg-secondary/10 p-3.5 rounded-xl border border-border/40">
                              <span className="text-[10px] font-mono text-muted-foreground tracking-wide uppercase">{label}</span>
                              <div className="mt-1 text-sm font-medium text-foreground">
                                {isUpload ? (
                                  (() => {
                                    const fileObj = selectedRegDetail.uploaded_files.find((f: any) => f.field_label === label);
                                    return fileObj ? (
                                      <a
                                        href={getApiUrl(fileObj.file_url)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
                                      >
                                        <FileText size={14} />
                                        {fileObj.original_name || 'Download file'}
                                      </a>
                                    ) : (
                                      <span className="text-xs text-muted-foreground">File not found</span>
                                    );
                                  })()
                                ) : Array.isArray(val) ? (
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {val.map((item: string) => (
                                      <span key={item} className="text-xs bg-secondary px-2.5 py-0.5 rounded border border-border/30 text-foreground">{item}</span>
                                    ))}
                                  </div>
                                ) : typeof val === 'boolean' ? (
                                  <span>{val ? 'Yes' : 'No'}</span>
                                ) : (
                                  <span className="whitespace-pre-wrap">{String(val)}</span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground text-center py-8">Failed to render registration details.</p>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Admin;
