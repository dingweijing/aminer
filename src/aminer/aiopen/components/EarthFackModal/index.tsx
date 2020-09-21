import React, { Component, ReactChildren, ReactComponentElement, ReactNode,useEffect,useRef, ReactElement,useState } from 'react';
import { FM } from 'locales';
import {getDomCenterPoint,get2PointCita} from 'utils/utils'
import styles from './style.less'

type targetPoint={x:number,y:number}

interface IPropTypes{
  targetPoint:targetPoint,
  children:ReactElement
}

const EarthFackModal: React.FC<IPropTypes> = props => {
  const {children,targetPoint}=props
  const [deg,setDeg]=useState(null)
  const myRef=useRef()

  const drawLine=()=>{
    if(myRef){
      const el=myRef.current
      if(el&&el.childNodes&&el.childNodes.length){
        // const realDOM=document.querySelector('.modal-inner')
        const modalCenterP=getDomCenterPoint(el)
         const d=get2PointCita(modalCenterP,targetPoint)
         setDeg(d)
      }else{
        setTimeout(()=>{
          drawLine()
        },500)
      }
    }
  }

  useEffect(()=>{
    // drawLine()
  },[])


  return(
    <div className={styles.wrapper}>
      <div className="modal-inner" ref={myRef} >
        {children}
      </div>
      {/* <div className="line" style={{transform:`rotate(${360-deg}deg) translateY(50%)`}}/> */}
    </div>
  )

}

export default EarthFackModal;
