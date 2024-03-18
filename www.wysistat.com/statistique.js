var wsdjid;var wsvudj;var wsref;var wscli;var wspage;var wsprof;var wscpt;
var wscook=ws_isCookAccept();
var wsecr=ws_getScreenSize();
var wsdjcook=0;
function stat(cli,frm,prm,ce,page,roi,prof){
 wysistat(cli,frm,prm,ce,page,roi,prof);
}
function wysistat(cli,frm,prm,ce,page,roi,prof,cpt,cst,evt,sa){
 var date=new Date();
 if(!frm){var frm=0;}
 if(!prm){var prm=0;}
 if(!ce){var ce=0;}
 if(!page){var page=0;}
 else{page=escape(page);}
 if(!roi){var roi=0;}
 if(!prof){var prof=0;}
 else{prof=escape(prof);}
 if(!cpt){var cpt=0;}
 else{cpt=escape(cpt);}
 if(!wsref){wsref="";}
 wsconsent=ws_getConsent(cst);
 if(!evt){evt="";}
 else{evt=ws_encode(evt)};
 if(!sa){sa="";}
 else{sa=escape(sa);}
 
 var wstb=ws_readCook();
 if(wstb.length>0){wsdjcook=1;}
 wstb=ws_majCook(wscook, wstb);
 ws_writeCook(wstb);
 
 var url="https://www.wysistat.com/images/"+cli+"/compteur.php?nom="+cli
 +"&tps="+date.getSeconds()+date.getMinutes()
 +"&ecran="+wsecr
 +"&origine="+escape(document.referrer)
 +"&origine_force="+escape(wsref)
 +"&frame="+frm
 +"&ParaWysistat="+prm
 +"&CompteurExtranet="+ce
 +"&consent="+wsconsent
 +"&event="+evt
 +"&SubAccount="+sa
 +"&ParaPage="+page
 +"&ParaProfiling="+prof
 +"&ParaCompte="+cpt
 +"&ParaRoi="+roi
 +"&ojd_version=2"
 +"&cookie="+wscook
 +"&deja_cookie="+wsdjcook
 +"&id="+wstb[0]
 +"&id_int="+wstb[5]
 +"&compteur_mois="+wstb[1]
 +"&compteur_jour="+wstb[3]
 +"&deja_id="+wsdjid
 +"&vu_diff_jour="+wsvudj
 +"&vu_time_prec="+wstb[4];
 var page_location=escape(location.href);
 if((url.length+page_location.length) > 2000){
  var tabTemp=page_location.split("%3F");
  url+="&page_js="+tabTemp[0];
 }else{
  url+="&page_js="+page_location;
 }
 var c=new Image(1,1);
 c.src=url;
 c.onload=function(){ws_retVide();}
 c.setAttribute("ALT","Tracker Wysistat");
 wscli=cli;
 wsprof=prof;
 wscpt=cpt;
 wspage=page;
}
function ws_getScreenSize(){
 if(document.layers){
  return window.innerWidth + "x" + window.innerHeight;
 }
 else {
  return screen.width + "x" + screen.height;
 }
}
function ws_retVide(){return;}
function ws_writeCook(tab){
 var i;var de;var v="";
 for(i=0;i<tab.length;i+=1){
  if(i>0){v+="§";}
  v+=tab[i];
 }
 var date=new Date();
 de=new Date(date.getTime()+34128000000);
 if(tab[6]){
  var tse = parseInt(tab[6]);
  de=new Date(tse);
 }
 document.cookie="Wysistat"+"="+encodeURIComponent(v)+";expires="+de.toGMTString()+";path=/;";
}
function ws_readCook(){
 var allcook=document.cookie.split("; ");
 var cook="";var tcook;var tab=new Array();
 for(i=0;i<allcook.length;i+=1){
  tcook=allcook[i].split("=");
  if(tcook[0]=="Wysistat"){
   cook=tcook[1];
   i=allcook.length;
  }
 }
 if(cook){
  try {
    cook=decodeURIComponent(cook);
  } 
  catch (e) {
    cook=unescape(cook);
  }
  tab=cook.split("§");
 }
 return tab;
}
function ws_majCook(acc, wstb){
 wsdjid=0;wsvudj=0;
 var date=new Date();
 var off=date.getTimezoneOffset()*60;
 var tms=date.getTime();
 var t=Math.floor(tms/1000);
 var tvu=0;
 var rand=Math.random()+"_"+tms;
 if(wstb.length>0){
  acc=1;
  var d=new Date();
  d.setTime(wstb[2]);
  if(wstb[4]){tvu=wstb[4];}
  if(d.getMonth()==date.getMonth()){
   if(d.getDate()==date.getDate()){
    if(tms>(d.getTime()+1800000)){wstb[1]++;wstb[3]++;wstb[0]=rand;}
    else{wsdjid="1";}
   }
   else{wstb[1]++;wstb[3]=1;wstb[0]=rand;wstb[4]=t;}
  }
  else{wstb[1]=1;wstb[3]=1;wstb[0]=rand;wstb[4]=t;}
 }
 else{
  wstb[1]=1;wstb[3]=1;wstb[0]=rand;wstb[4]=t;
 }
 wstb[2]=tms;
 if(wstb[1]>1000){wstb[1]="1";}
 if(!wstb[0]){wstb[0]=rand;}
 if(!wstb[4]){wstb[4]=0;}
 if(tvu!=0){wsvudj=Math.floor((t-off)/3600/24)-Math.floor((tvu-off)/3600/24);}
 if(!wstb[5] && acc){wstb[5]=wstb[0];}
 else if(!wstb[5]){wstb[5]=0;}
 var de = date.getTime()+34128000000;
 if(!wstb[6]){wstb[6]=de;}
 return wstb;
}

function ws_isCookAccept(){
 var acc=0;var test;
 var n="WysistatAC";
 var v=encodeURIComponent("WysistatAC");
 var da=new Date();
 var de=new Date(da.getTime()+2592000000);
 document.cookie=n+"="+v+";expires="+de.toGMTString()+";path=/; samesite=none; secure;";
 test=document.cookie.indexOf(n+"="+v);
 if(test>=0){acc=1;}
 de=new Date(da.getTime()-8760);
 document.cookie=n+"="+";expires="+de.toGMTString()+";path=/; samesite=none; secure;";
 return acc;
}

function storageAvailable(type){
 try {
  var storage=window[type];
  var x="__storage_test__";
  storage.setItem(x,x);
  storage.removeItem(x);
  return true;
 }
 catch(e){
  return e instanceof DOMException && (
   e.code === 22 ||
   e.code === 1014 ||
   e.name === "QuotaExceededError" ||
   e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
   storage.length !== 0;
 }
}
function ws_encode(evt=""){
  evt = evt.replace(/&#34;/g, '"');
  evt = evt.replace(/&#39;/g, "'");
  evt = evt.replace(/&#\d+;/g, ' ');
  evt = evt.replace(/&/g, ' ');
  return evt;
}
function ws_getConsent(cst=""){
 var allcook=document.cookie.split("; ");
 if (cst){
  const cookie = cst.split(";");
  var cstName = cookie[0];
  var cstValue = cookie[1];
  var fullcook=allcook.find(row => row.startsWith(cstName+"="));
  if(fullcook){
   if(fullcook.indexOf(cstValue)>0){return 1;}
   else{return 2;}
  }
 }
 var cookieNameEU = "euconsent-v2=";
 var fullcookEU=allcook.find(rowEU => rowEU.startsWith(cookieNameEU));
 if(fullcookEU){
  if(fullcookEU.substring(cookieNameEU.length+24,cookieNameEU.length+27) == "AP_"){return 1;}
  else{return 2;}
 }
 var cookieNameEUP = "eupubconsent-v2=";
 var fullcookEUP=allcook.find(rowEU => rowEU.startsWith(cookieNameEUP));
 if(fullcookEUP){
  if(fullcookEUP.substring(cookieNameEUP.length+24,cookieNameEUP.length+27) == "AP_"){return 1;}
  else{return 2;}
 }
 var fullcookT=allcook.find(rowT => rowT.startsWith("tarteaucitron="));
 if(fullcookT){
  if (fullcookT.indexOf("true")>0){return 1;}
  else{return 2;}
 }
 var fullcookC=allcook.find(rowC => rowC.startsWith("cookie_notice_accepted="));
 if(fullcookC){
  if (fullcookC.indexOf("true")>0){return 1;}
  else{return 2;}
 }
 var fullcookTC=allcook.find(rowTC => rowTC.startsWith("TC_PRIVACY_CENTER="));
 if(fullcookTC){
  if (fullcookTC.length>18){return 1;}
  else{return 2;}
 }
 var fullcookAX=allcook.find(rowTC => rowTC.startsWith("axeptio_authorized_vendors="));
 if(fullcookAX){
  var fullcookAXTmp = fullcookAX.replace(/%2C/g, "");
  if (fullcookAXTmp.length>27){return 1;}
  else{return 2;}
 }
 var fullcookCC=allcook.find(rowCC => rowCC.startsWith("CookieConsent="));
 if(fullcookCC){
  if (fullcookCC.indexOf("statistics:true")>0){return 1;}
  else{return 2;}
 }
 if (storageAvailable("localStorage")){
  var storS=localStorage.getItem("appconsent");
  if (storS){
   var jsonS=JSON.parse(storS);
   if (jsonS.consents && jsonS.consents.stacks[0] && jsonS.consents.stacks[0].status && jsonS.consents.stacks[0].status == 1){return 1;}
   else{return 2;}
  }
  var storFC=localStorage.getItem("sas_euconsent_v2");
  if (storFC){
   if (storFC.indexOf("CoAP_")>0){return 1;}
   else{return 2;}
  }
  var storSP=localStorage.getItem("sp_user_consent");
  if (storSP){
   if (storSP.indexOf("true")>0){return 1;}
   else{return 2;}
  }
 }
 return 0;
}
wysi=valeur=1;