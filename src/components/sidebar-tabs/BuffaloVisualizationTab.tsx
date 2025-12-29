import React from 'react';

const BuffaloVisualizationTab: React.FC = () => {
    return (
        <div style={{ width: '100%', height: 'calc(100vh - 60px)', overflow: 'hidden' }}>
            <iframe
                src="/buffalo_viz/index.html"
                title="Buffalo Visualization"
                width="100%"
                height="100%"
                style={{ border: 'none' }}
            />
        </div>
    );
};

export default BuffaloVisualizationTab;
