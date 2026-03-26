-- Create a table specifically for AI Club events
CREATE TABLE club_events (
    id SERIAL PRIMARY KEY,
    event_name VARCHAR(255) NOT NULL,
    event_date DATE NOT NULL,
    summary TEXT NOT NULL,         -- This is what the AI will read
    winners TEXT,                 -- Store who won for the "Recap"
    key_highlights TEXT,          -- Specific bullet points for the AI
    created_at TIMESTAMP DEFAULT CURRENT_SERVER_TIME
);

-- Example data for your AI Triathlon
INSERT INTO club_events (event_name, event_date, summary, winners, key_highlights)
VALUES (
    'AI Triathlon 2026', 
    '2026-03-20', 
    'A high-energy competition featuring robotics, coding, and data science.',
    'Team Alpha (Robotics), Team Beta (Coding)',
    '30 teams participated; Viral Vision Kaggle challenge was the highlight; Dr. Smith gave the keynote.'
);
