import React from 'react'
import '../styles/Header.sass'

export default function Header(): React.ReactNode {
  return (
    <header>
      <div className="title">
        <h1>Dev</h1>
      </div>
      <div className="bar" />
    </header>
  )
}
