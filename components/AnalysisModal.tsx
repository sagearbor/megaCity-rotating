import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { AIAnalysisResult } from '../types';
interface AnalysisModalProps {isOpen:boolean;onClose:()=>void;data:AIAnalysisResult|null;isLoading:boolean;}
export const AnalysisModal=({isOpen,onClose,data,isLoading}:AnalysisModalProps)=>{
 const ref=useRef<HTMLDialogElement>(null);
 useEffect(()=>{if(isOpen&&!ref.current?.open)ref.current?.showModal();else if(!isOpen&&ref.current?.open)ref.current.close();},[isOpen]);
 return <dialog ref={ref} onCancel={e=>{e.preventDefault();onClose();}} aria-labelledby="design-note-title" style={{background:'var(--surface)',color:'var(--text)',border:'1px solid var(--line)',padding:28,maxWidth:560,width:'calc(100% - 32px)',margin:'auto'}}><div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:20}}><h3 id="design-note-title">{data?.title??'Design note'}</h3><button autoFocus className="icon-button" aria-label="Close design note" onClick={onClose}><X size={18}/></button></div><p style={{marginTop:24,whiteSpace:'pre-wrap'}}>{isLoading?'Opening design note…':data?.content??'No note available.'}</p><button className="button secondary" style={{marginTop:24}} onClick={onClose}>Close</button></dialog>;
};
