import {createContext,useContext,useState} from 'react';
import {initial} from './data/demo';
const Context=createContext(null);const KEY='campus-updates-new-demo-v1';
export function Store({children}){const [data,setData]=useState(()=>{try{return JSON.parse(localStorage.getItem(KEY))||structuredClone(initial)}catch{return structuredClone(initial)}});const [toast,setToast]=useState('');
function update(fn){setData(old=>{const next=fn(old);try{localStorage.setItem(KEY,JSON.stringify(next))}catch{setToast('Browser storage is full. Your changes are available for this visit.')}return next})}
function notify(text){setToast(text);setTimeout(()=>setToast(''),3500)}
function toggle(key,id){if(!data.user){notify('Sign in with a demo account to continue');return false}update(d=>({...d,[key]:d[key].includes(id)?d[key].filter(x=>x!==id):[...d[key],id]}));return true}
return <Context.Provider value={{data,update,toggle,notify}}>{children}{toast&&<div className="toast" role="status">{toast}</div>}</Context.Provider>}
export const useStore=()=>useContext(Context);
