import React from 'react'

const Card04 = props => (
  <div id='saveArea' style={{ textAlign: 'center',
    height: '425px',
    width: '695px',
    fontFamily: props.titleFontType,
    backgroundImage: props.background,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    margin: '0 auto'}}>
    <p style={{ color: 'white', fontSize: props.titleFontSize, padding: '10% 0 5% 35%', marginTop: 0 }}> {props.title} </p>
    <p style={{ color: 'white', fontSize: '22px', padding: '0 0 0 36%' }}> {props.date} </p>
    <p style={{ color: 'white', fontSize: '15px', padding: '0 0 5% 36%' }}> {props.time} </p>
    <p style={{ color: 'white', fontSize: '18px', padding: '0 0 0 36%' }}> {props.location} </p>
  </div>
)

export default Card04
