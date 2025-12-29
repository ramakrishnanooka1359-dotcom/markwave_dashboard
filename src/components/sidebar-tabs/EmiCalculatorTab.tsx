import React from 'react';

const EmiCalculatorTab: React.FC = () => {
    return (
        <div style={{ width: '100%', height: 'calc(100vh - 60px)', overflow: 'hidden' }}>
            <iframe
                src="/emi_calculator/index.html"
                title="EMI Calculator"
                width="100%"
                height="100%"
                style={{ border: 'none' }}
            />
        </div>
    );
};

export default EmiCalculatorTab;
