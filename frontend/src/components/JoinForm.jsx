import { useState } from 'react';

export default function JoinForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    branch: '',
    interest: '',
    reason: ''
  });

  // Track the submission status: 'idle', 'submitting', 'success', or 'error'
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage(''); // Clear any previous errors

    try {
      // 1. The Fetch Request
      const response = await fetch('http://localhost:5000/api/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Tell the server we are sending JSON
        },
        body: JSON.stringify(formData) // Convert our React state object into a JSON string
      });

      // 2. Parse the backend's response
      const data = await response.json();

      // 3. Handle Success or Failure
      if (response.ok) {
        setStatus('success');
        // Clear the form for the next person
        setFormData({ name: '', email: '', branch: '', interest: '', reason: '' });
      } else {
        setStatus('error');
        setErrorMessage(data.error || 'Something went wrong on the server.');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setStatus('error');
      setErrorMessage('Failed to connect to the server. Is the backend running?');
    }
  };

  return (
    <section id="join" className="fade-in visible">
      <div className="section-label">// 06 — Join Us</div>
      <div className="join-box">
        <h2>Ready to Build the Future?</h2>
        <p>Whether you're a complete beginner or a published researcher, NeuralNode has a place for you.</p>

        <form onSubmit={handleSubmit} style={{ maxWidth: '560px', margin: '0 auto', textAlign: 'left' }}>
          <div className="form-row">
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required disabled={status === 'submitting'} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required disabled={status === 'submitting'} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Branch / Year</label>
              <input type="text" name="branch" value={formData.branch} onChange={handleChange} required disabled={status === 'submitting'} />
            </div>
            <div className="form-group">
              <label>Interest Area</label>
              <select name="interest" value={formData.interest} onChange={handleChange} required disabled={status === 'submitting'}>
                <option value="">Select...</option>
                <option value="NLP / LLMs">NLP / LLMs</option>
                <option value="Computer Vision">Computer Vision</option>
                <option value="Reinforcement Learning">Reinforcement Learning</option>
                <option value="Generative AI">Generative AI</option>
                <option value="MLOps">MLOps / Deployment</option>
              </select>
            </div>
          </div>
          
          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label>Why do you want to join? (optional)</label>
            <textarea name="reason" value={formData.reason} onChange={handleChange} placeholder="Tell us a bit about yourself..." disabled={status === 'submitting'}></textarea>
          </div>

          {/* Dynamic Button UI */}
          <button 
            type="submit" 
            className="btn-primary" 
            style={{ width: '100%', textAlign: 'center', padding: '16px', opacity: status === 'submitting' ? 0.7 : 1 }}
            disabled={status === 'submitting'}
          >
            {status === 'submitting' ? 'Sending...' : 'Submit Application →'}
          </button>

          {/* Feedback Messages */}
          {status === 'success' && (
            <div style={{ marginTop: '16px', color: 'var(--accent2)', textAlign: 'center', fontSize: '14px', fontWeight: '500' }}>
              🎉 Success! Your application has been received. We'll be in touch soon!
            </div>
          )}
          {status === 'error' && (
            <div style={{ marginTop: '16px', color: 'var(--accent3)', textAlign: 'center', fontSize: '14px', fontWeight: '500' }}>
              ⚠️ {errorMessage}
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
