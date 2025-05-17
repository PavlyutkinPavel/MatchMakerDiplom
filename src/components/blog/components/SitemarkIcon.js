import * as React from 'react';
import logo from "../../../assets/img/logo.png";
export default function SitemarkIcon() {
    return (
        <img
            src={logo}
            alt="MatchMaker Logo"
            style={{
                width: 64,
                height: 'auto',
                transition: 'transform 0.3s ease',
                cursor: 'pointer',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1.0)')}
        />
    );
}
