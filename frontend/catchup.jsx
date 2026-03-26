import React, { useEffect, useState } from 'react';

const EventSummary = () => {
    const [summary, setSummary] = useState("Generating summary...");

    useEffect(() => {
        fetch('http://localhost:8000/api/event-recap')
            .then(res => res.json())
            .then(data => setSummary(data.summary));
    }, []);

    return (
        <div className="summary-card">
            <h2>✨ Missed the Action?</h2>
            <div className="ai-content">
                {summary}
            </div>
        </div>
    );
};
