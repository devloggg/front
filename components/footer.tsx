import React from 'react'

import '../styles/Footer.sass'

export default function Footer(): React.ReactNode {
  return (
    <footer>
      <div className="bar" />
      <div className="info-box">
        <div className="title">
          <h1>Dev</h1>
        </div>
        <div className="info">
          <a href="https://github.com/devloggg">Github</a>
        </div>
        <div className="info">Email</div>
        <div className="info">Social</div>
      </div>
    </footer>
  )
}
