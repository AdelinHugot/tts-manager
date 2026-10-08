/* eslint-disable */
// ⚠️  FICHIER GÉNÉRÉ — ne pas éditer à la main.
// Source : design/TTS Manager.dc.html (bloc <script data-dc-script>)
// Générateur : tools/dc-to-jsx.mjs · Régénérer avec : npm run gen:view
import React from 'react';
import { DCLogic } from './lib/dc.js';
import { complete } from './lib/claude.js';
import * as donnees from './lib/commandesFirestore.js';

const window_claude = { complete };
const window_donnees = donnees;

export class Logic extends DCLogic {
  constructor(props){
    super(props);
    this.rootRef = React.createRef();
    this.fileInputRef = React.createRef();
    this.importInputRef = React.createRef();
    this.recognition = null;
    this.chartRef = (el)=>{
      if(el && el!==this._chartEl){
        this._chartEl=el;
        if(this._chartRO) this._chartRO.disconnect();
        this._chartRO=new ResizeObserver(()=>{
          const w=el.clientWidth, h=el.clientHeight;
          if(Math.abs(w-(this.state.chartW||0))>1 || Math.abs(h-(this.state.chartH||0))>1) this.setState({chartW:w,chartH:h});
        });
        this._chartRO.observe(el);
        const w=el.clientWidth, h=el.clientHeight;
        if(w&&h&&(w!==this.state.chartW||h!==this.state.chartH)) this.setState({chartW:w,chartH:h});
      }
    };
    this.state = {
      page:'dashboard', tab:'compte', period:'mois', topMetric:'ca',
      periodOpen:false, hoverIdx:null,
      sort:{ marques:{key:'ca',dir:'desc'}, produits:{key:'ca',dir:'desc'}, videos:{key:'ca',dir:'desc'}, partenaires:{key:'ca',dir:'desc'}, partnerProducts:{key:'ca',dir:'desc'}, commandes:{key:'dateKey',dir:'desc'} },
      ordFilters:{ vendeur:'Tous les vendeurs', statut:'Tous les statuts', from:'', to:'' },
      ordLoading:false, ordErr:null, ordPage:1,
      importEnCours:false, importMsg:null, importErr:null,
      dashLoading:false, dashErr:null,
      ideasErr:null, ideasEnvoi:null,
      bibErr:null, bibEnvoi:null,
      menuMobileOuvert:false,
      deconnexionEnCours:false,
      dpOpen:false, dpMonth:'2026-08', dpStart:null, dpEnd:null,
      customRange:null,
      profile: window_donnees
        ? {name:'',handle:'',email:'',phone:''}
        : {name:'Camille Léon',handle:'@camilleleon',email:'camille@ttsmanager.fr',phone:'+33 6 12 34 56 78'},
      profilErr:null, profilEnvoi:false,
      avatarUrl:null, profileSaved:false,
      pwd:{current:'',next:'',confirm:''}, pwdMsg:null, pwdMsgOk:false,
      notifs:{daily:true,newOrder:false,brandMail:true,payout:true},
      selectedPartner:null,
      selectedProspectId:null,
      threadReply:{subject:'',body:''},
      chat:[], chatInput:'', chatBusy:false, chatErr:null,
      rushView:'grid', rushFolder:null, rushQuery:'', rushDrag:false, rushOverId:null,
      rushRenameId:null, rushRenameVal:'', rushPreviewId:null, rushNextId:100,
      rushItems: window_donnees ? [] : [
        {id:1,kind:'folder',name:'Sérum Vitamine C',parent:null,createdAt:Date.now()-1000*60*60*72},
        {id:2,kind:'folder',name:'Rituel Nuit — août',parent:null,createdAt:Date.now()-1000*60*60*50},
        {id:3,kind:'folder',name:'À trier',parent:null,createdAt:Date.now()-1000*60*60*30},
        {id:4,kind:'file',name:'unboxing_serum_prise2.mov',parent:null,createdAt:Date.now()-1000*60*90,size:412000000,ext:'MOV',duration:74},
        {id:5,kind:'file',name:'hook_3erreurs_v3.mp4',parent:null,createdAt:Date.now()-1000*60*260,size:88000000,ext:'MP4',duration:12},
        {id:6,kind:'file',name:'plan_produit_lumiere_4k.mp4',parent:null,createdAt:Date.now()-1000*60*60*8,size:1240000000,ext:'MP4',duration:38},
        {id:7,kind:'file',name:'voix_off_routine.webm',parent:null,createdAt:Date.now()-1000*60*60*26,size:14000000,ext:'WEBM',duration:96},
        {id:8,kind:'file',name:'avant_apres_semaine2.mkv',parent:1,createdAt:Date.now()-1000*60*60*40,size:640000000,ext:'MKV',duration:52}
      ],
      vidView:'grid', vidFolder:null, vidQuery:'', vidDrag:false, vidOverId:null, vidFilter:'Tous',
      vidRenameId:null, vidRenameVal:'', vidPreviewId:null, vidMenuId:null, vidNextId:200,
      vidItems: window_donnees ? [] : [
        {id:11,kind:'folder',name:'Lumière Skincare',parent:null,createdAt:Date.now()-1000*60*60*90},
        {id:12,kind:'folder',name:'NordTech',parent:null,createdAt:Date.now()-1000*60*60*60},
        {id:13,kind:'file',name:'3 erreurs skincare à éviter',parent:null,createdAt:Date.now()-1000*60*60*20,size:96000000,ext:'MP4',duration:34,status:'Postée'},
        {id:14,kind:'file',name:'Ma routine du soir en 2 min',parent:null,createdAt:Date.now()-1000*60*60*46,size:142000000,ext:'MP4',duration:118,status:'Postée'},
        {id:15,kind:'file',name:'Avant/après sérum — v2',parent:null,createdAt:Date.now()-1000*60*180,size:210000000,ext:'MOV',duration:41,status:'En cours de modifs'},
        {id:16,kind:'file',name:'Hook unboxing écouteurs',parent:null,createdAt:Date.now()-1000*60*60*8,size:88000000,ext:'MP4',duration:22,status:'Prête à poster'},
        {id:17,kind:'file',name:'Comparatif palettes nude',parent:null,createdAt:Date.now()-1000*60*60*30,size:64000000,ext:'MP4',duration:57,status:'À monter'},
        {id:18,kind:'file',name:'Routine peau grasse été',parent:11,createdAt:Date.now()-1000*60*60*70,size:120000000,ext:'MP4',duration:73,status:'Postée'}
      ],
      view:'pinterest', composerText:'', isRecording:false, aiProcessing:false, dragOver:false,
      nextIdeaId:4,
      // Dans l'application, les idees viennent de Firestore : partir du jeu de
      // demonstration le ferait clignoter avant la premiere reponse du serveur.
      ideas: window_donnees ? [] : [
        {id:1,type:'text',text:'Vidéo "3 signes que tu dois changer ta routine skincare" — format liste rapide, hook fort dans les 2 premières secondes.',pinned:true,createdAt:Date.now()-1000*60*60*5},
        {id:2,type:'link',url:'https://www.tiktok.com/@exemple/video/123456',pinned:false,createdAt:Date.now()-1000*60*60*20},
        {id:3,type:'text',text:"Idée : comparatif avant/après avec le sérum vitamine C sur 2 semaines, format split-screen.",pinned:false,createdAt:Date.now()-1000*60*60*30}
      ],
      prospectFormOpen:false, prospectForm:{name:'',contact:''},
      nextProspectId:6,
      prospects:[
        {id:1,name:'Bloom Cosmétiques',contact:'contact@bloom-cosmetiques.fr',status:'Contacté',added:'12/06/2026'},
        {id:2,name:'Nova Tech',contact:'partnerships@novatech.io',status:'À contacter',added:'28/06/2026'},
        {id:3,name:'Verde Naturals',contact:'hello@verdenaturals.com',status:'Relance',added:'20/06/2026'},
        {id:4,name:'Lumen Jewelry',contact:'collab@lumenjewelry.com',status:'En négociation',added:'15/06/2026'},
        {id:5,name:'Café Botanique',contact:'marque@cafebotanique.fr',status:'Refusé',added:'02/06/2026'}
      ],
      threads:{
        1:[
          {from:'me',date:'12/06/2026',subject:'Collaboration avec Bloom Cosmétiques ?',body:"Bonjour, je suis créatrice de contenu TikTok Shop et j'adore votre gamme de soins. Je serais ravie d'échanger sur une collaboration affiliée. Au plaisir de vous lire !"},
          {from:'them',date:'14/06/2026',subject:'Re: Collaboration avec Bloom Cosmétiques ?',body:"Bonjour, merci pour votre message ! Votre univers colle bien avec notre marque. Pouvez-vous nous partager vos statistiques (vues moyennes, taux d'engagement) ?"},
          {from:'me',date:'15/06/2026',subject:'Re: Collaboration avec Bloom Cosmétiques ?',body:"Bien sûr, je vous envoie mon kit média cette semaine avec mes performances des 3 derniers mois. Merci pour votre retour rapide !"}
        ],
        3:[
          {from:'me',date:'20/06/2026',subject:'Collaboration avec Verde Naturals ?',body:"Bonjour, je suis créatrice de contenu TikTok Shop, spécialisée cosmétique naturelle. Une collaboration affiliée vous intéresserait-elle ?"},
          {from:'me',date:'27/06/2026',subject:'Petite relance 🙂',body:"Bonjour, je me permets de revenir vers vous concernant mon message du 20/06 — êtes-vous disponible cette semaine pour en discuter ?"}
        ],
        4:[
          {from:'me',date:'15/06/2026',subject:'Collaboration avec Lumen Jewelry ?',body:"Bonjour, je suis créatrice de contenu TikTok Shop et vos bijoux seraient parfaits pour mon contenu GRWM. Partante pour une collab affiliée ?"},
          {from:'them',date:'16/06/2026',subject:'Re: Collaboration avec Lumen Jewelry ?',body:"Bonjour, avec plaisir ! Nous travaillons habituellement à 12% de commission — est-ce que ça vous convient ?"},
          {from:'me',date:'17/06/2026',subject:'Re: Collaboration avec Lumen Jewelry ?',body:"Ça me va très bien. Est-ce qu'on peut aussi prévoir l'envoi de 2-3 pièces produits pour le premier contenu ?"},
          {from:'them',date:'19/06/2026',subject:'Re: Collaboration avec Lumen Jewelry ?',body:"Oui, aucun souci. Envoyez-nous votre adresse, on prépare le colis dès cette semaine."}
        ],
        5:[
          {from:'me',date:'02/06/2026',subject:'Collaboration avec Café Botanique ?',body:"Bonjour, je suis créatrice de contenu TikTok Shop, votre concept me plaît beaucoup. Seriez-vous ouverts à une collaboration affiliée ?"},
          {from:'them',date:'05/06/2026',subject:'Re: Collaboration avec Café Botanique ?',body:"Bonjour, merci pour votre intérêt. Nous ne travaillons pas encore avec des créateurs affiliés pour le moment, mais nous garderons votre contact."}
        ]
      }
    };
    this.PROSPECT_STATUSES = ['À contacter','Contacté','Relance','En négociation','Accepté','Refusé'];

    this.THEMES = {
      Lavande:{ '--bg':'#F6F4FD','--sidebar':'#FFFFFF','--border':'#EFECF9','--border-2':'#E5E1F3','--primary':'#7C6FF7','--primary-2':'#6356E6','--primary-soft':'#EEEBFE','--primary-softer':'#F6F4FE','--secondary':'#4FA688','--secondary-soft':'#E5F3EC','--text':'#211E33','--text-2':'#5E5A72','--text-3':'#9A96AC' },
      Menthe:{ '--bg':'#EFFBF7','--sidebar':'#FFFFFF','--border':'#E3F1EC','--border-2':'#D4EAE2','--primary':'#28B39A','--primary-2':'#1C9B85','--primary-soft':'#DBF4EE','--primary-softer':'#EDFAF6','--secondary':'#7C6FF7','--secondary-soft':'#EEEBFE','--text':'#16302A','--text-2':'#4E635D','--text-3':'#8AA39C' },
      Indigo:{ '--bg':'#F2F5FD','--sidebar':'#FFFFFF','--border':'#E8ECF9','--border-2':'#DBE1F4','--primary':'#6477F0','--primary-2':'#4F63E0','--primary-soft':'#E6EAFD','--primary-softer':'#F1F3FD','--secondary':'#4FA688','--secondary-soft':'#E5F3EC','--text':'#1B2138','--text-2':'#555D78','--text-3':'#9095AE' }
    };

    this.PERIODS = [
      {id:'mois',label:'Ce mois-ci',gran:'day',ca:48250,com:6782,reglees:342,attente:28,ineligibles:12,panier:38.4,caT:14.9,comT:20.3,ordT:14.8,panierT:-1.3},
      {id:'moisprec',label:'Mois précédent',gran:'day',ca:41980,com:5640,reglees:298,attente:0,ineligibles:9,panier:38.9,caT:8.2,comT:6.1,ordT:7.0,panierT:1.1},
      {id:'trim',label:'Ce trimestre',gran:'week',ca:138400,com:19250,reglees:1024,attente:46,ineligibles:38,panier:37.9,caT:14.1,comT:16.8,ordT:11.2,panierT:-0.3},
      {id:'trimprec',label:'Trim. précédent',gran:'week',ca:121300,com:16480,reglees:921,attente:0,ineligibles:31,panier:38.0,caT:9.0,comT:7.4,ordT:6.1,panierT:1.0},
      {id:'annee',label:'Cette année',gran:'month',ca:512800,com:71200,reglees:4180,attente:62,ineligibles:148,panier:38.1,caT:32.0,comT:34.6,ordT:30.2,panierT:1.3},
      {id:'anneeprec',label:'Année dernière',gran:'month',ca:388500,com:52900,reglees:3210,attente:0,ineligibles:96,panier:37.6,caT:21.0,comT:19.4,ordT:18.0,panierT:0.6}
    ];

    this.PAGES = {
      dashboard:{title:'Dashboard',sub:"Vue d'ensemble de ton activité"},
      analytics:{title:'Analytics',sub:'Performances détaillées par compte, marque, produit et vidéo'},
      commandes:{title:'Commandes',sub:'Suivi des commandes affiliées'},
      videos:{title:'Vidéos',sub:'Bibliothèque de contenus publiés'},
      idees:{title:'Idées',sub:"Ton mur de brainstorming — textes, liens, vidéos"},
      rushs:{title:'Rushs',sub:'Tes fichiers bruts en attente de montage'},
      assistant:{title:'Assistant',sub:'Ton conseiller data — il lit tes chiffres et te dit quoi pousser'},
      partenaires:{title:'Partenaires',sub:'Marques avec qui tu collabores'},
      prospection:{title:'Prospection',sub:'Partenaires en cours de prospection et envoi d\u2019emails'},
      parametres:{title:'Paramètres',sub:'Préférences du compte'}
    };

    this.BRANDS = [
      {name:'Lumière Skincare',orders:142,ca:6840,com:1094,panier:48.2,vues:1450000},
      {name:'Velour Cosmetics',orders:98,ca:5210,com:730,panier:53.2,vues:980000},
      {name:'NordTech',orders:76,ca:8930,com:357,panier:117.5,vues:210000},
      {name:'PureGlow',orders:124,ca:4180,com:585,panier:33.7,vues:1620000},
      {name:'Maison Belle',orders:88,ca:3920,com:470,panier:44.5,vues:540000},
      {name:'FitForm',orders:64,ca:2870,com:344,panier:44.8,vues:380000},
      {name:'GlowUp Beauty',orders:156,ca:5640,com:902,panier:36.2,vues:2100000},
      {name:'Aroma Home',orders:52,ca:2140,com:86,panier:41.2,vues:190000}
    ];

    this.PRODUCTS = [
      {name:'Sérum Vitamine C 30ml',boutique:'Lumière Skincare',orders:96,ca:3264,com:522,panier:34.0,vues:620000},
      {name:'Coffret Rituel Nuit',boutique:'Lumière Skincare',orders:46,ca:3576,com:572,panier:77.7,vues:830000},
      {name:'Palette Nude 12 teintes',boutique:'Velour Cosmetics',orders:64,ca:2880,com:432,panier:45.0,vues:410000},
      {name:'Mascara Volume Infini',boutique:'Velour Cosmetics',orders:88,ca:2330,com:298,panier:26.5,vues:570000},
      {name:'Écouteurs Sans Fil Pro',boutique:'NordTech',orders:42,ca:5460,com:218,panier:130.0,vues:95000},
      {name:'Chargeur MagSafe 3-en-1',boutique:'NordTech',orders:58,ca:2610,com:117,panier:45.0,vues:115000},
      {name:'Gel Nettoyant Doux',boutique:'PureGlow',orders:112,ca:2240,com:314,panier:20.0,vues:980000},
      {name:'Crème Hydratante 24h',boutique:'PureGlow',orders:74,ca:1940,com:271,panier:26.2,vues:640000},
      {name:'Diffuseur Huiles Ess.',boutique:'Aroma Home',orders:38,ca:1520,com:61,panier:40.0,vues:190000},
      {name:'Brosse Lissante Ionique',boutique:'GlowUp Beauty',orders:84,ca:3360,com:537,panier:40.0,vues:720000}
    ];

    this.VIDEOS = [
      {titre:'3 erreurs skincare à éviter',produit:'Sérum Vitamine C 30ml',orders:38,ca:1292,com:206,vues:380000},
      {titre:'Ma routine du soir en 2 min',produit:'Coffret Rituel Nuit',orders:22,ca:1709,com:273,vues:1240000},
      {titre:'Test palette nude girl next door',produit:'Palette Nude 12 teintes',orders:29,ca:1305,com:196,vues:9000},
      {titre:'Ce mascara tient 16h 😮',produit:'Mascara Volume Infini',orders:41,ca:1086,com:139,vues:892000},
      {titre:'Setup bureau esthétique',produit:'Chargeur MagSafe 3-en-1',orders:18,ca:810,com:36,vues:1600},
      {titre:'Unboxing écouteurs Pro',produit:'Écouteurs Sans Fil Pro',orders:15,ca:1950,com:78,vues:2100},
      {titre:'Routine peau grasse été',produit:'Gel Nettoyant Doux',orders:52,ca:1040,com:146,vues:1530000},
      {titre:'Le gadget qui change ma douche',produit:'Brosse Lissante Ionique',orders:33,ca:1320,com:211,vues:8000}
    ];

    this.FILE = [
      {titre:'Avant/après 4 semaines — sérum',produit:'Sérum Vitamine C 30ml',statut:'À tourner'},
      {titre:'GRWM soirée + palette nude',produit:'Palette Nude 12 teintes',statut:'Script'},
      {titre:'Top 3 produits tech sous 50 €',produit:'Chargeur MagSafe 3-en-1',statut:'À monter'},
      {titre:'ASMR application crème hydratante',produit:'Crème Hydratante 24h',statut:'À publier'},
      {titre:'Réponse commentaire : ça marche ?',produit:'Brosse Lissante Ionique',statut:'À tourner'},
      {titre:'Idée cadeau — coffret rituel',produit:'Coffret Rituel Nuit',statut:'Script'}
    ];
  }

  componentDidMount(){ this.applyTheme(); this.chargerCommandes(); this.chargerTableauDeBord(); this.ecouterIdees(); this.ecouterBibliotheques(); this.chargerResume(); this.ecouterProfil(); }
  // Ecoute continue plutot que chargement ponctuel : une idee jetee depuis le
  // telephone doit apparaitre ici sans recharger la page.
  ecouterIdees(){
    const api = window_donnees;
    if(!api) return;
    this._stopIdees = api.ecouterIdees(
      idees=>this.setState({ideas:idees, ideasErr:null}),
      ()=>this.setState({ideasErr:'Les idées ne se synchronisent plus. Recharge la page.'})
    );
  }
  componentWillUnmount(){ if(this._chartRO) this._chartRO.disconnect(); if(this._stopIdees) this._stopIdees(); if(this._stopBib) this._stopBib.forEach(f=>f()); if(this._stopProfil) this._stopProfil(); }
  componentDidUpdate(){
    this.applyTheme();
    // La periode affichee pilote ce qui est charge : changer les dates recharge,
    // changer vendeur/statut/tri ne recharge pas — ces filtres s'appliquent en
    // memoire sur la periode deja en main.
    if(!window_donnees) return;
    if(this._dashCle !== this.state.period) this.chargerTableauDeBord();
    if(this._chargementEnCours) return;
    const F=this.state.ordFilters;
    if(this._periode !== F.from+'→'+F.to) this.chargerCommandes();
  }
  applyTheme(){
    const t = this.THEMES[this.props.palette] || this.THEMES.Lavande;
    if(this.rootRef.current){ for(const k in t) this.rootRef.current.style.setProperty(k,t[k]); }
  }

  /* ---------- helpers ---------- */
  hash(s){ let h=2166136261; for(let i=0;i<s.length;i++){ h^=s.charCodeAt(i); h=Math.imul(h,16777619); } return h>>>0; }
  rng(seed){ let a=seed>>>0; return ()=>{ a|=0; a=a+0x6D2B79F5|0; let t=Math.imul(a^a>>>15,1|a); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }
  fmtEur(n,dec){ if(n===null||n===undefined||!isFinite(n)) return '—'; dec=dec||0; return Number(n).toLocaleString('fr-FR',{minimumFractionDigits:dec,maximumFractionDigits:dec})+' €'; }
  fmtNum(n){ return Number(n).toLocaleString('fr-FR'); }
  fmtPct(n,dec){ if(n===null||n===undefined||!isFinite(n)) return '—'; dec=(dec==null)?1:dec; return Number(n).toLocaleString('fr-FR',{minimumFractionDigits:dec,maximumFractionDigits:dec})+' %'; }
  // Les libelles produits de TikTok Shop depassent couramment 150 caracteres et
  // rendent le tableau illisible. Le nom complet reste accessible au survol.
  tronquer(t,max){
    const s=String(t||'');
    return s.length>max ? s.slice(0,max-1).replace(/[\s\u00A0]+$/,'')+'…' : s;
  }
  fmtViews(n){ if(n===null||n===undefined) return '—'; if(n>=1e6) return (n/1e6).toLocaleString('fr-FR',{maximumFractionDigits:1})+'M'; if(n>=1e3) return (n/1e3).toLocaleString('fr-FR',{maximumFractionDigits:1})+'k'; return this.fmtNum(n); }
  fmtTrend(t){ return (t>0?'+':'')+Number(t).toLocaleString('fr-FR',{minimumFractionDigits:1,maximumFractionDigits:1})+' %'; }
  trendObj(t){
    // Sans periode de comparaison exploitable, on affiche un tiret plutot qu'un
    // pourcentage calcule a partir de zero, qui ne voudrait rien dire.
    if(t===null||t===undefined||!isFinite(t)) return { trend:'—', trendBg:'#F1F0F5', trendFg:'var(--text-3)', trendIcon:null };
    const up=t>=0; return { trend:this.fmtTrend(t), trendBg:up?'var(--pos-soft)':'var(--neg-soft)', trendFg:up?'var(--pos)':'var(--neg)', trendIcon:this.iconEl(up?'arrow-up':'arrow-down',11,2.4) }; }
  tauxBadge(t){ if(t>=10) return {bg:'var(--green-soft)',fg:'var(--green)'}; if(t>=5) return {bg:'var(--blue-soft)',fg:'var(--blue)'}; return {bg:'var(--amber-soft)',fg:'var(--amber)'}; }
  convBadge(c){ if(c>=1) return {bg:'var(--green-soft)',fg:'var(--green)'}; if(c>=0.3) return {bg:'var(--blue-soft)',fg:'var(--blue)'}; return {bg:'var(--amber-soft)',fg:'var(--amber)'}; }

  iconEl(name,size,sw,remplissage){
    size=size||18; sw=sw||1.8;
    const M={
      home:[['path',{d:'m3 9.5 9-7 9 7V20a1.5 1.5 0 0 1-1.5 1.5H4.5A1.5 1.5 0 0 1 3 20z'}],['path',{d:'M9 21.5V12h6v9.5'}]],
      chart:[['path',{d:'M3 3v17a1 1 0 0 0 1 1h17'}],['path',{d:'m7 14 3.5-4 3 2.5L20 7'}]],
      bag:[['path',{d:'M5 8h14l-1 12.5a1 1 0 0 1-1 .9H7a1 1 0 0 1-1-.9z'}],['path',{d:'M8.5 8V6a3.5 3.5 0 0 1 7 0v2'}]],
      video:[['rect',{x:2.5,y:6,width:14,height:12,rx:2.5}],['path',{d:'M16.5 10 21 7.5v9L16.5 14'}]],
      bulb:[['path',{d:'M9 18h6'}],['path',{d:'M10 21.5h4'}],['path',{d:'M12 2.5a6 6 0 0 0-3.5 10.8c.6.5 1 1.2 1 2v.2h5v-.2c0-.8.4-1.5 1-2A6 6 0 0 0 12 2.5z'}]],
      box:[['path',{d:'M21 8.2 12 12.8 3 8.2'}],['path',{d:'M12 12.8V22'}],['path',{d:'M20.5 7.3 12.8 3.2a1.7 1.7 0 0 0-1.6 0L3.5 7.3a1.7 1.7 0 0 0-.9 1.5v6.4a1.7 1.7 0 0 0 .9 1.5l7.7 4.1a1.7 1.7 0 0 0 1.6 0l7.7-4.1a1.7 1.7 0 0 0 .9-1.5V8.8a1.7 1.7 0 0 0-.9-1.5z'}]],
      settings:[['circle',{cx:12,cy:12,r:3}],['path',{d:'M12 2.5v3M12 18.5v3M4.4 4.4l2.1 2.1M17.5 17.5l2.1 2.1M2.5 12h3M18.5 12h3M4.4 19.6l2.1-2.1M17.5 6.5l2.1-2.1'}]],
      calendar:[['rect',{x:3,y:5,width:18,height:16,rx:2.5}],['path',{d:'M3 9.5h18M8 3v4M16 3v4'}]],
      chevron:[['path',{d:'m6 9.5 6 6 6-6'}]],
      chevronR:[['path',{d:'m9 6 6 6-6 6'}]],
      check:[['path',{d:'m5 12.5 4.5 4.5L19 7'}]],
      'arrow-up':[['path',{d:'M12 19V5M6 11l6-6 6 6'}]],
      'arrow-down':[['path',{d:'M12 5v14M6 13l6 6 6-6'}]],
      alert:[['path',{d:'M10.3 3.8 2.6 17.5A1.5 1.5 0 0 0 3.9 19.8h16.2a1.5 1.5 0 0 0 1.3-2.3L13.7 3.8a1.5 1.5 0 0 0-2.6 0z'}],['path',{d:'M12 9v4M12 16.5h.01'}]],
      euro:[['path',{d:'M18.5 7.5a6.5 6.5 0 1 0 0 9M4 10.5h9M4 13.5h8'}]],
      wallet:[['rect',{x:3,y:6,width:18,height:13,rx:2.5}],['path',{d:'M3 10.5h18'}],['path',{d:'M16.5 14.5h1.5'}]],
      percent:[['path',{d:'M19 5 5 19'}],['circle',{cx:7,cy:7,r:2}],['circle',{cx:17,cy:17,r:2}]],
      tiktok:[['path',{d:'M9.5 9.5a3.5 3.5 0 1 0 3.5 3.5V4c.4 2.2 2.2 3.8 4.5 4'}]],
      users:[['circle',{cx:9,cy:8,r:3}],['path',{d:'M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6'}],['circle',{cx:17,cy:9,r:2.3}],['path',{d:'M15.5 14.2c2.4.4 4.5 2.4 4.5 5.8'}]],
      send:[['path',{d:'M4 20 20 12 4 4l3 8z'}],['path',{d:'M7 12h6'}]],
      plus:[['path',{d:'M12 5v14M5 12h14'}]],
      trash:[['path',{d:'M4 7h16'}],['path',{d:'M9 7V4.5h6V7'}],['path',{d:'M6 7l1 13h10l1-13'}]],
      chevronL:[['path',{d:'m14 6-6 6 6 6'}]],
      mail:[['rect',{x:3,y:5,width:18,height:14,rx:2.5}],['path',{d:'m4 7 8 6 8-6'}]],
      mic:[['rect',{x:9,y:3,width:6,height:10,rx:3}],['path',{d:'M5 11a7 7 0 0 0 14 0'}],['path',{d:'M12 18v3'}]],
      link:[['path',{d:'M9.5 14.5 14.5 9.5'}],['path',{d:'M11 6.3 12.8 4.5a3.6 3.6 0 0 1 5.1 5.1L16 11.4'}],['path',{d:'M13 17.7 11.2 19.5a3.6 3.6 0 0 1-5.1-5.1L8 12.6'}]],
      folder:[['path',{d:'M3 7.5A1.5 1.5 0 0 1 4.5 6h4l2 2.5h7A1.5 1.5 0 0 1 19 10v8a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 3 18z'}]],
      folderPlus:[['path',{d:'M3 7.5A1.5 1.5 0 0 1 4.5 6h4l2 2.5h7A1.5 1.5 0 0 1 19 10v8a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 3 18z'}],['path',{d:'M11 14h4M13 12v4'}]],
      upload:[['path',{d:'M12 16V4M7.5 8.5 12 4l4.5 4.5'}],['path',{d:'M4 15v3.5A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5V15'}]],
      grid:[['rect',{x:3.5,y:3.5,width:7,height:7,rx:2}],['rect',{x:13.5,y:3.5,width:7,height:7,rx:2}],['rect',{x:3.5,y:13.5,width:7,height:7,rx:2}],['rect',{x:13.5,y:13.5,width:7,height:7,rx:2}]],
      list:[['path',{d:'M4 6.5h16M4 12h16M4 17.5h16'}]],
      pen:[['path',{d:'M4 20h4L20 8a2.5 2.5 0 0 0-3.5-3.5L4.5 16.5z'}],['path',{d:'M15 6l3 3'}]],
      play:[['path',{d:'M8 5.5 18.5 12 8 18.5z'}]],
      film:[['rect',{x:3,y:4,width:18,height:16,rx:2.5}],['path',{d:'M7.5 4v16M16.5 4v16'}],['path',{d:'M3 8h4.5M3 12h4.5M3 16h4.5M16.5 8H21M16.5 12H21M16.5 16H21'}]],
      spark:[['path',{d:'M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z'}],['path',{d:'M18.5 15.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z'}]],
      pin:[['path',{d:'M12 2.5c-3 0-5.4 2.4-5.4 5.4 0 3.8 5.4 10.6 5.4 10.6s5.4-6.8 5.4-10.6c0-3-2.4-5.4-5.4-5.4z'}],['circle',{cx:12,cy:7.9,r:2}]],
      logout:[['path',{d:'M15 4.5h3.5A1.5 1.5 0 0 1 20 6v12a1.5 1.5 0 0 1-1.5 1.5H15'}],['path',{d:'M10.5 15.5 14 12l-3.5-3.5'}],['path',{d:'M14 12H4'}]],
      star:[['path',{d:'M12 3.1l2.65 5.6 5.85.86-4.25 4.3 1 6.14L12 17.1l-5.25 2.9 1-6.14-4.25-4.3 5.85-.86z'}]],
      chantier:[['path',{d:'M12 9v4.5'}],['path',{d:'M12 17.2h.01'}],['path',{d:'M10.3 3.9 2.6 17.4a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z'}]]
    };
    const kids=(M[name]||[]).map((c,i)=>React.createElement(c[0],Object.assign({key:i},c[1])));
    return React.createElement('svg',{width:size,height:size,viewBox:'0 0 24 24',fill:remplissage||'none',stroke:'currentColor',strokeWidth:sw,strokeLinecap:'round',strokeLinejoin:'round'},kids);
  }

  /* ---------- charts ---------- */
  genSeries(p){
    if(this._dash && this._dash.cle===this.state.period && this._dash.serie) return this._dash.serie;
    if(this.enLigne()){
      const vides = p.gran==='day'?30 : p.gran==='week'?13 : 12;
      return Array.from({length:vides},()=>({ca:0,com:0,label:''}));
    }
    const n = p.gran==='day'?15 : p.gran==='week'?13 : 12;
    const r = this.rng(this.hash(p.id));
    const ratio = p.com/p.ca;
    const months=['Jan','Fév','Mar','Avr','Mai','Juin','Juil','Aoû','Sep','Oct','Nov','Déc'];
    let w=[],sum=0;
    for(let i=0;i<n;i++){ const trend=0.78+0.5*(i/(n-1)); const noise=0.72+0.56*r(); const v=trend*noise; w.push(v); sum+=v; }
    return w.map((wi,i)=>{
      const ca=p.ca*wi/sum;
      const com=ca*ratio*(0.86+0.28*r());
      let label;
      if(p.gran==='day') label=String(Math.round(1+i*(29/(n-1))));
      else if(p.gran==='week') label='S'+(i+1);
      else label=months[i];
      return {ca,com,label};
    });
  }

  renderLineChart(p){
    const h=React.createElement;
    const data=this.genSeries(p), n=data.length;
    const W=Math.round(this.state.chartW)||760, H=Math.round(this.state.chartH)||276;
    const padL=48,padR=54,padT=18,padB=30;
    const plotW=W-padL-padR, plotH=H-padT-padB, base=padT+plotH;
    // Plancher a 1 : sur une periode sans commande, tous les points valent zero
    // et une division par zero produirait des coordonnees NaN, donc un graphique
    // vide mais casse plutot qu'un graphique vide et propre.
    const sommet=(cle,marge)=>Math.max(1,Math.max.apply(null,[0].concat(data.map(d=>d[cle]))))*marge;
    const caMax=sommet('ca',1.16);
    const comMax=sommet('com',1.5);
    const X=i=> padL + plotW*(n===1?0.5:i/(n-1));
    const yCa=v=> base - plotH*v/caMax;
    const yCom=v=> base - plotH*v/comMax;
    const path=(fy,xacc)=> data.map((d,i)=>(i?'L':'M')+X(i).toFixed(1)+' '+fy(d[xacc]).toFixed(1)).join(' ');
    const caLine=path(yCa,'ca'), comLine=path(yCom,'com');
    const area=caLine+' L '+X(n-1).toFixed(1)+' '+base+' L '+X(0).toFixed(1)+' '+base+' Z';
    const fmtK=v=> v>=1000 ? (v/1000).toLocaleString('fr-FR',{maximumFractionDigits:v>=10000?0:1})+' k€' : Math.round(v)+' €';
    const grid=[0,0.25,0.5,0.75,1];
    const step=Math.max(1,Math.ceil(n/7));
    const hi=this.state.hoverIdx;

    const kids=[];
    kids.push(h('defs',{key:'d'},h('linearGradient',{id:'caGrad',x1:0,y1:0,x2:0,y2:1},
      h('stop',{offset:'0%',stopColor:'var(--primary)',stopOpacity:0.20}),
      h('stop',{offset:'100%',stopColor:'var(--primary)',stopOpacity:0}))));
    grid.forEach((f,i)=>{
      const y=padT+plotH*f;
      kids.push(h('line',{key:'g'+i,x1:padL,y1:y,x2:padL+plotW,y2:y,stroke:'var(--border)',strokeWidth:1}));
      kids.push(h('text',{key:'ll'+i,x:padL-9,y:y+3.5,textAnchor:'end',fontSize:10,fontWeight:600,fill:'var(--text-3)'},fmtK(caMax*(1-f))));
      kids.push(h('text',{key:'rl'+i,x:padL+plotW+9,y:y+3.5,textAnchor:'start',fontSize:10,fontWeight:600,fill:'var(--text-3)'},fmtK(comMax*(1-f))));
    });
    data.forEach((d,i)=>{ if(i%step===0||i===n-1) kids.push(h('text',{key:'x'+i,x:X(i),y:base+18,textAnchor:'middle',fontSize:10.5,fontWeight:600,fill:'var(--text-3)'},d.label)); });
    kids.push(h('path',{key:'area',d:area,fill:'url(#caGrad)'}));
    kids.push(h('path',{key:'cal',d:caLine,fill:'none',stroke:'var(--primary)',strokeWidth:2.4,strokeLinejoin:'round',strokeLinecap:'round'}));
    kids.push(h('path',{key:'com',d:comLine,fill:'none',stroke:'var(--secondary)',strokeWidth:2.4,strokeLinejoin:'round',strokeLinecap:'round'}));
    if(hi!=null && data[hi]){
      kids.push(h('line',{key:'gl',x1:X(hi),y1:padT,x2:X(hi),y2:base,stroke:'var(--border-2)',strokeWidth:1.5,strokeDasharray:'3 4'}));
      kids.push(h('circle',{key:'dc',cx:X(hi),cy:yCa(data[hi].ca),r:4.5,fill:'var(--primary)',stroke:'#fff',strokeWidth:2}));
      kids.push(h('circle',{key:'dm',cx:X(hi),cy:yCom(data[hi].com),r:4.5,fill:'var(--secondary)',stroke:'#fff',strokeWidth:2}));
    }
    kids.push(h('rect',{key:'ov',x:padL,y:padT,width:plotW,height:plotH,fill:'transparent',
      onMouseMove:e=>{ const r=e.currentTarget.ownerSVGElement.getBoundingClientRect(); const sx=(e.clientX-r.left)*(W/r.width); let i=Math.round((sx-padL)/plotW*(n-1)); i=Math.max(0,Math.min(n-1,i)); if(i!==this.state.hoverIdx) this.setState({hoverIdx:i}); },
      onMouseLeave:()=>this.setState({hoverIdx:null}) }));

    const svg=h('svg',{viewBox:'0 0 '+W+' '+H,preserveAspectRatio:'none',style:{width:'100%',height:'100%',display:'block',overflow:'visible'}},kids);

    let tip=null;
    if(hi!=null && data[hi]){
      const leftPct=(X(hi)/W*100);
      tip=h('div',{style:{position:'absolute',left:leftPct+'%',top:'2px',transform:'translateX(-50%)',background:'var(--text)',color:'#fff',padding:'8px 11px',borderRadius:'10px',fontSize:'11.5px',fontWeight:600,whiteSpace:'nowrap',pointerEvents:'none',boxShadow:'0 6px 18px rgba(20,12,50,0.28)',zIndex:5}},
        h('div',{style:{opacity:0.7,fontWeight:600,marginBottom:4}},data[hi].label),
        h('div',{style:{display:'flex',alignItems:'center',gap:6}},h('span',{style:{width:7,height:7,borderRadius:2,background:'var(--primary)'}}),'CA ',h('span',{style:{marginLeft:'auto',fontVariantNumeric:'tabular-nums'}},this.fmtEur(Math.round(data[hi].ca)))),
        h('div',{style:{display:'flex',alignItems:'center',gap:6,marginTop:2}},h('span',{style:{width:7,height:7,borderRadius:2,background:'var(--secondary)'}}),'Com. ',h('span',{style:{marginLeft:'auto',fontVariantNumeric:'tabular-nums'}},this.fmtEur(Math.round(data[hi].com)))));
    }
    return h('div',{ref:this.chartRef,style:{position:'relative',width:'100%',flex:'1 1 0',minHeight:'200px',display:'flex'}},tip,svg);
  }

  renderDonut(p){
    const h=React.createElement;
    const total=p.reglees+p.attente+p.ineligibles;
    const aff=Math.round(total*0.78), pub=total-aff;
    const affPct=aff/total, pubPct=1-affPct;
    const r=64,cx=90,cy=90,C=2*Math.PI*r;
    const svg=h('svg',{viewBox:'0 0 180 180',style:{width:160,height:160,display:'block',margin:'4px auto 0'}},
      h('circle',{cx:cx,cy:cy,r:r,fill:'none',stroke:'var(--border)',strokeWidth:24}),
      h('circle',{cx:cx,cy:cy,r:r,fill:'none',stroke:'var(--primary)',strokeWidth:24,strokeLinecap:'butt',strokeDasharray:(affPct*C)+' '+C,transform:'rotate(-90 90 90)'}),
      h('circle',{cx:cx,cy:cy,r:r,fill:'none',stroke:'var(--secondary)',strokeWidth:24,strokeLinecap:'butt',strokeDasharray:(pubPct*C)+' '+C,strokeDashoffset:(-affPct*C),transform:'rotate(-90 90 90)'}),
      h('text',{x:90,y:84,textAnchor:'middle',fontSize:30,fontWeight:700,fill:'var(--text)'},this.fmtNum(total)),
      h('text',{x:90,y:104,textAnchor:'middle',fontSize:12,fontWeight:600,fill:'var(--text-3)'},'commandes'));
    const legRow=(c,label,val,pct)=>h('div',{style:{display:'flex',alignItems:'center',gap:9,padding:'7px 0'}},
      h('span',{style:{width:10,height:10,borderRadius:3,background:c,flex:'none'}}),
      h('span',{style:{fontSize:13,fontWeight:600,flex:1}},label),
      h('span',{style:{fontSize:13,fontWeight:700,fontVariantNumeric:'tabular-nums'}},this.fmtNum(val)),
      h('span',{style:{fontSize:12,color:'var(--text-3)',fontWeight:600,width:42,textAlign:'right'}},this.fmtPct(pct*100,0)));
    const legend=h('div',{style:{marginTop:14,borderTop:'1px solid var(--border)',paddingTop:6}},
      legRow('var(--primary)','Affiliée',aff,affPct),
      legRow('var(--secondary)','Pub Shopping',pub,pubPct));
    return h('div',{},svg,legend);
  }

  /* ---------- paramètres ---------- */
  /**
   * Carte du compte, en bas du menu.
   *
   * Le nom saisi prime, l'adresse de connexion sert de repli : un compte sans
   * profil rempli doit quand meme s'identifier, et afficher un nom invente
   * serait pire que d'afficher l'e-mail.
   */
  carteCompte(){
    const S=this.state;
    if(!this.enLigne()) return {nom:'Camille Léon', sous:'Créatrice · Pro', initiales:'CL', photo:null, sansPhoto:true};
    const email=(this.props.user&&this.props.user.email)||'';
    const nom=(S.profile.name||'').trim()||email||'Mon compte';
    const pseudo=(S.profile.handle||'').trim();
    return {
      nom:nom,
      sous:pseudo||email,
      initiales:(nom.trim().charAt(0)||'?').toUpperCase(),
      photo:S.avatarUrl||null,
      sansPhoto:!S.avatarUrl
    };
  }

  ecouterProfil(){
    const api=window_donnees;
    if(!api) return;
    const email=(this.props.user&&this.props.user.email)||'';
    this._stopProfil = api.ecouterProfil(p=>{
      // Les champs en cours d'edition ne sont pas ecrases par l'ecoute : sinon
      // taper son nom deviendrait impossible des qu'une ecriture revient.
      if(this._profilTouche) return;
      this.setState({
        profile:{name:p.name||'', handle:p.handle||'', email:email, phone:p.phone||''},
        avatarUrl:p.avatarUrl||null
      });
      this._avatarPath = p.avatarPath||null;
    }, ()=>this.setState({profilErr:'Le profil ne se synchronise plus. Recharge la page.'}));
  }

  enregistrerProfil(){
    const api=window_donnees;
    if(!api) return this.setState({profileSaved:true});
    const P=this.state.profile;
    this.setState({profilErr:null});
    api.enregistrerProfil({name:(P.name||'').trim(), handle:(P.handle||'').trim(), phone:(P.phone||'').trim()})
      .then(()=>{ this._profilTouche=false; this.setState({profileSaved:true}); })
      .catch(err=>{ console.error('Profil non enregistre', err); this.setState({profilErr:"Le profil n'a pas pu être enregistré."}); });
  }

  setProfile(k,v){
    if(window_donnees) this._profilTouche = true; this.setState(s=>({profile:Object.assign({},s.profile,{[k]:v}),profileSaved:false})); }
  setPwd(k,v){ this.setState(s=>({pwd:Object.assign({},s.pwd,{[k]:v}),pwdMsg:null})); }
  toggleNotif(k){ this.setState(s=>({notifs:Object.assign({},s.notifs,{[k]:!s.notifs[k]})})); }
  pickAvatar(e){
    const f=e.target.files&&e.target.files[0];
    e.target.value='';
    if(!f) return;
    const api=window_donnees;
    if(api){
      this.setState({profilEnvoi:true, profilErr:null});
      return api.envoyerAvatar(f)
        .then(({chemin})=>{ this._avatarPath=chemin; this.setState({profilEnvoi:false}); })
        .catch(err=>{
          console.error('Envoi de la photo interrompu', err);
          this.setState({profilEnvoi:false, profilErr:err.message||"La photo n'a pas pu être envoyée."});
        });
    }
    if(this.state.avatarUrl) URL.revokeObjectURL(this.state.avatarUrl);
    this.setState({avatarUrl:URL.createObjectURL(f),profileSaved:false});
  }
  removeAvatar(){
    const api=window_donnees;
    if(api){
      return api.retirerAvatar(this._avatarPath)
        .then(()=>{ this._avatarPath=null; })
        .catch(err=>{ console.error('Retrait de la photo impossible', err); this.setState({profilErr:"La photo n'a pas pu être retirée."}); });
    }
    if(this.state.avatarUrl) URL.revokeObjectURL(this.state.avatarUrl);
    this.setState({avatarUrl:null,profileSaved:false});
  }
  pwdScore(p){
    let s=0; if(p.length>=8) s++; if(/[A-Z]/.test(p)) s++; if(/[0-9]/.test(p)) s++; if(/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  }
  submitPwd(){
    const P=this.state.pwd;
    if(!P.current) return this.setState({pwdMsg:'Renseigne ton mot de passe actuel.',pwdMsgOk:false});
    if(this.pwdScore(P.next)<3) return this.setState({pwdMsg:'8 caractères minimum, avec majuscule et chiffre.',pwdMsgOk:false});
    if(P.next!==P.confirm) return this.setState({pwdMsg:'Les deux mots de passe ne correspondent pas.',pwdMsgOk:false});
    this.setState({pwd:{current:'',next:'',confirm:''},pwdMsg:'Mot de passe mis à jour.',pwdMsgOk:true});
  }

  /* ---------- session ---------- */
  // La fonction vient d'App.jsx en prop : la logique issue du design ne connait
  // pas Firebase. Hors application — apercu du design — elle est absente, et le
  // bouton reste alors sans effet plutot que de casser la maquette.
  seDeconnecter(){
    const partir = this.props.deconnexion;
    if(!partir || this.state.deconnexionEnCours) return;
    this.setState({deconnexionEnCours:true});
    Promise.resolve(partir()).catch(err=>{
      // En cas d'echec on redonne la main : laisser le bouton fige donnerait
      // l'illusion d'une deconnexion qui n'a pas eu lieu.
      console.error('Deconnexion impossible', err);
      this.setState({deconnexionEnCours:false});
    });
  }

  /* ---------- tableau de bord ---------- */
  // La periode selectionnee est chargee avec celle qui lui sert de comparaison,
  // puis tout — totaux, evolutions, serie du graphique, top produits — se calcule
  // en memoire. Les regroupements par produit ne sont pas faisables cote serveur :
  // Firestore ne sait pas grouper.
  chargerTableauDeBord(){
    const api = window_donnees;
    if(!api || this._dashEnCours) return;

    const id = this.state.period;
    this._dashEnCours = true;
    this._dashCle = id;   // retenu avant l'appel : un echec ne doit pas boucler
    this.setState({dashLoading:true, dashErr:null});

    let bornes;
    try { bornes = api.bornesPeriode(id); }
    catch(err){
      console.error('Periode inconnue', err);
      this._dashEnCours = false;
      return this.setState({dashLoading:false, dashErr:'Période inconnue.'});
    }

    api.chargerPeriodeEtPrecedente(bornes).then(({courant, precedent})=>{
      const t = api.totaux(courant);
      this._dash = {
        cle:id, bornes:bornes, commandes:courant, totaux:t,
        evolutions:api.evolutions(t, api.totaux(precedent)),
        serie:api.serie(courant, api.intervalles(bornes))
      };
      this.setState({dashLoading:false});
    }).catch(err=>{
      console.error('Chargement du tableau de bord interrompu', err);
      this._dash = null;
      this.setState({dashLoading:false, dashErr:'Impossible de charger les indicateurs.'});
    }).then(()=>{ this._dashEnCours = false; });
  }

  /**
   * Vrai dans l'application, faux dans l'apercu du design.
   *
   * C'est la frontiere qui decide si le jeu de demonstration a le droit de
   * s'afficher. Dans l'application, il ne doit JAMAIS apparaitre : le voir
   * clignoter une fraction de seconde avant les vrais chiffres donne a croire
   * a des donnees qui n'existent pas.
   */
  enLigne(){ return !!window_donnees; }

  /** Periode affichee : reelle des que chargee, jeu de demonstration sinon. */
  periodeCourante(){
    const base = this.PERIODS.find(p=>p.id===this.state.period) || this.PERIODS[0];
    const d = this._dash;
    if(d && d.cle === this.state.period) return Object.assign({}, base, d.totaux, d.evolutions);
    if(this.enLigne()) return Object.assign({}, base, {ca:0,com:0,orders:0,reglees:0,attente:0,ineligibles:0,panier:0,caT:null,comT:null,ordT:null,panierT:null});
    return base;
  }

  /** Les indicateurs sont-ils prets a etre lus ? Faux pendant le chargement. */
  dashPret(){
    if(!this.enLigne()) return true;   // apercu du design : le jeu de demonstration fait foi
    return !this.state.dashLoading && !!(this._dash && this._dash.cle === this.state.period);
  }

  /* ---------- bibliotheques (videos et rushs) ---------- */
  // Les deux pages partagent ces methodes : meme structure, donc meme code.
  // Hors ligne — apercu du design — elles rendent la main et chaque page garde
  // son comportement en memoire.
  ecouterBibliotheques(){
    const api = window_donnees;
    if(!api) return;
    this._stopBib = [
      api.ecouterBibliotheque(api.VIDEOS, items=>this.setState({vidItems:items}), ()=>this.bibPanne()),
      api.ecouterBibliotheque(api.RUSHES, items=>this.setState({rushItems:items}), ()=>this.bibPanne())
    ];
  }
  bibPanne(){ this.setState({bibErr:'La bibliothèque ne se synchronise plus. Recharge la page.'}); }
  bibEchec(err,msg){ console.error(msg, err); this.setState({bibEnvoi:null, bibErr:msg}); }

  bibEnvoyer(collection, dossier, files){
    const api = window_donnees;
    if(!files.length) return;
    this.setState({bibErr:null, bibEnvoi:0});
    // En serie plutot qu'en parallele : plusieurs envois simultanes se volent la
    // bande passante et rendent la progression illisible.
    files.reduce(
      (chaine,f)=>chaine.then(()=>api.envoyerDansBibliotheque(collection,f,dossier,pct=>this.setState({bibEnvoi:pct}))),
      Promise.resolve()
    ).then(()=>this.setState({bibEnvoi:null}))
     .catch(err=>this.bibEchec(err,"L'envoi n'a pas abouti."));
  }

  bibNouveauDossier(collection, dossier, nom, cleRenomme, cleValeur){
    window_donnees.creerDossier(collection, nom, dossier)
      .then(id=>this.setState({[cleRenomme]:id, [cleValeur]:nom}))
      .catch(err=>this.bibEchec(err,"Le dossier n'a pas pu être créé."));
  }

  bibSupprimer(collection, items, id, clePreview){
    const element = items.find(i=>i.id===id);
    if(!element) return;
    window_donnees.supprimerElement(collection, element, items)
      .catch(err=>this.bibEchec(err,"La suppression n'a pas abouti."));
    this.setState(s=>({[clePreview]: s[clePreview]===id ? null : s[clePreview]}));
  }

  /* ---------- rushs ---------- */
  rushChildren(){
    const S=this.state, q=S.rushQuery.trim().toLowerCase();
    let arr=S.rushItems.filter(i=>i.parent===S.rushFolder);
    if(q) arr=S.rushItems.filter(i=>i.name.toLowerCase().indexOf(q)>=0);
    return arr.sort((a,b)=>(a.kind===b.kind ? b.createdAt-a.createdAt : (a.kind==='folder'?-1:1)));
  }
  rushAddFiles(files){
    if(window_donnees) return this.bibEnvoyer(window_donnees.RUSHES, this.state.rushFolder, files);
    if(!files.length) return;
    const items=files.map((f,k)=>{
      const id=this.state.rushNextId+k;
      const ext=(f.name.split('.').pop()||'').toUpperCase();
      const item={id,kind:'file',name:f.name,parent:this.state.rushFolder,createdAt:Date.now(),size:f.size,ext:ext,url:URL.createObjectURL(f),duration:null};
      const v=document.createElement('video');
      v.preload='metadata';
      v.onloadedmetadata=()=>{ const d=v.duration; this.setState(s=>({rushItems:s.rushItems.map(i=>i.id===id?Object.assign({},i,{duration:d}):i)})); };
      v.src=item.url;
      return item;
    });
    this.setState(s=>({rushItems:s.rushItems.concat(items),rushNextId:s.rushNextId+items.length,rushDrag:false}));
  }
  rushNewFolderFn(){
    if(window_donnees){
      const nom='Nouveau dossier '+(this.state.rushItems.filter(i=>i.kind==='folder').length+1);
      return this.bibNouveauDossier(window_donnees.RUSHES, this.state.rushFolder, nom, 'rushRenameId', 'rushRenameVal');
    }
    const id=this.state.rushNextId;
    const n=this.state.rushItems.filter(i=>i.kind==='folder').length+1;
    this.setState(s=>({
      rushItems:s.rushItems.concat([{id,kind:'folder',name:'Nouveau dossier '+n,parent:s.rushFolder,createdAt:Date.now()}]),
      rushNextId:id+1, rushRenameId:id, rushRenameVal:'Nouveau dossier '+n
    }));
  }
  rushDelete(id){
    if(window_donnees) return this.bibSupprimer(window_donnees.RUSHES, this.state.rushItems, id, 'rushPreviewId');
    this.setState(s=>{
      const target=s.rushItems.find(i=>i.id===id);
      if(target&&target.url) URL.revokeObjectURL(target.url);
      return {rushItems:s.rushItems.filter(i=>i.id!==id&&i.parent!==id), rushPreviewId:s.rushPreviewId===id?null:s.rushPreviewId};
    });
  }
  rushMove(id,parent){
    if(id===parent) return;
    if(window_donnees){ this.setState({rushOverId:null});
      return window_donnees.deplacer(window_donnees.RUSHES,id,parent).catch(e=>this.bibEchec(e,"Le déplacement n'a pas abouti.")); }
    this.setState(s=>({rushItems:s.rushItems.map(i=>i.id===id?Object.assign({},i,{parent:parent}):i), rushOverId:null}));
  }
  rushSaveName(){
    if(window_donnees){
      const id=this.state.rushRenameId, v=(this.state.rushRenameVal||'').trim();
      this.setState({rushRenameId:null});
      if(!v) return;
      return window_donnees.renommer(window_donnees.RUSHES,id,v).catch(e=>this.bibEchec(e,"Le renommage n'a pas abouti."));
    }
    const id=this.state.rushRenameId, v=this.state.rushRenameVal.trim();
    if(!v) return this.setState({rushRenameId:null});
    this.setState(s=>({rushItems:s.rushItems.map(i=>i.id===id?Object.assign({},i,{name:v}):i), rushRenameId:null}));
  }

  /* ---------- import ---------- */
  ouvrirImport(){ if(this.importInputRef.current) this.importInputRef.current.click(); }
  onFichierImport(e){
    const fichier = e.target.files && e.target.files[0];
    e.target.value = '';   // permet de reimporter le meme fichier d'affilee
    if(!fichier) return;
    const api = window_donnees;
    if(!api) return;

    this.setState({importEnCours:true, importMsg:'Lecture du fichier…', importErr:null});

    api.analyserFichier(fichier).then(r=>{
      if(!r.commandes.length){
        this.setState({importEnCours:false, importMsg:null,
          importErr:"Aucune commande lisible dans ce fichier. Verifie qu'il s'agit bien d'un export de commissions TikTok Shop."});
        return;
      }
      return api.importerCommandes(r.commandes, (faites,total)=>{
        this.setState({importMsg:'Ecriture — '+this.fmtNum(faites)+' / '+this.fmtNum(total)});
      }).then(bilan=>{
        const pluriel=(n,mot,suffixe)=>this.fmtNum(n)+' '+mot+(n>1?(suffixe||'s'):'');
        const parties=[pluriel(bilan.ajoutees,'ajoutée'), pluriel(bilan.misesAJour,'mise')+(bilan.misesAJour>1?' à jour':' à jour')];
        if(r.doublonsDansLeFichier) parties.push(pluriel(r.doublonsDansLeFichier,'doublon')+' dans le fichier');
        if(r.ignorees) parties.push(pluriel(r.ignorees,'ligne')+' ignorée'+(r.ignorees>1?'s':''));
        this._periode = null;   // force le rechargement de la periode affichee
        this.setState({importEnCours:false, importMsg:parties.join(' · ')});
      });
    }).catch(err=>{
      console.error('Import interrompu', err);
      this.setState({importEnCours:false, importMsg:null,
        importErr:'Import impossible : '+((err && err.message) || 'fichier illisible')});
    });
  }

  /* ---------- commandes ---------- */
  // Charge les commandes du compte connecte depuis Firestore. Hors application
  // — apercu du design — `window_donnees` n'existe pas : on garde alors le jeu
  // de demonstration genere par genOrders(), pour que la maquette reste lisible.
  oublierCachesCommandes(){ this.ORDERS = null; this._ordersCache = null; }
  chargerCommandes(){
    const api = window_donnees;
    if(!api || this._chargementEnCours) return;
    const F = this.state.ordFilters;
    const choisie = (F.from || F.to) ? {from:F.from, to:F.to} : null;

    this._chargementEnCours = true;
    // Retenu avant meme l'appel : en cas d'echec, componentDidUpdate ne doit pas
    // relancer la meme requete en boucle.
    this._periode = F.from+'→'+F.to;
    this.setState({ordLoading:true, ordErr:null});

    Promise.resolve(choisie || api.periodeParDefaut()).then(p=>{
      if(!p){ this._commandes=[]; this.oublierCachesCommandes(); this.setState({ordLoading:false}); return; }
      return api.chargerPeriode(p).then(rows=>{
        this._commandes = rows;
        this._periode = p.from+'→'+p.to;
        this.oublierCachesCommandes();   // caches bâtis sur le jeu de démonstration
        this.setState(s=>({ ordLoading:false, ordPage:1,
          ordFilters:Object.assign({},s.ordFilters,{from:p.from,to:p.to}) }));
      });
    }).catch(err=>{
      console.error('Chargement des commandes interrompu', err);
      this.setState({ordLoading:false, ordErr:'Impossible de charger les commandes.'});
    }).then(()=>{ this._chargementEnCours = false; });
  }
  genOrders(){
    if(this.enLigne()) return this._commandes || [];
    let s=987654321; const rnd=()=>{ s=(s*1103515245+12345)%2147483648; return s/2147483648; };
    const dist=[['Réglée',0.58],['En attente',0.2],['Inéligible',0.12],['Remboursée',0.1]];
    const out=[];
    for(let i=0;i<58;i++){
      const p=this.PRODUCTS[Math.floor(rnd()*this.PRODUCTS.length)];
      const qty=1+Math.floor(rnd()*3);
      const gmv=Math.round(p.panier*qty*100)/100;
      const rate=p.com/p.ca;
      const r=rnd(); let acc=0, st='Réglée';
      for(let j=0;j<dist.length;j++){ acc+=dist[j][1]; if(r<=acc){ st=dist[j][0]; break; } }
      const m=6+Math.floor(rnd()*3);
      const d=1+Math.floor(rnd()*28);
      const pad=n=>(n<10?'0':'')+n;
      out.push({
        dateKey:'2026-'+pad(m+1)+'-'+pad(d),
        dateLabel:pad(d)+'/'+pad(m+1)+'/2026',
        produit:p.name, vendeur:p.boutique, statut:st, gmv:gmv,
        com: (st==='Réglée'||st==='En attente') ? Math.round(gmv*rate*100)/100 : 0
      });
    }
    return out;
  }
  orderStatusColor(st){
    const M={ 'Réglée':{bg:'var(--green-soft)',fg:'var(--green)'}, 'En attente':{bg:'var(--amber-soft)',fg:'var(--amber)'}, 'Inéligible':{bg:'var(--neg-soft)',fg:'var(--neg)'}, 'Remboursée':{bg:'#F1F0F5',fg:'var(--text-3)'} };
    return M[st]||M['Réglée'];
  }
  iso(d){ const p=n=>(n<10?'0':'')+n; return d.getFullYear()+'-'+p(d.getMonth()+1)+'-'+p(d.getDate()); }
  frDate(isoStr){ const a=isoStr.split('-'); return a[2]+'/'+a[1]+'/'+a[0]; }
  monthLabel(ym){ const [y,m]=ym.split('-').map(Number); const N=['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']; return N[m-1]+' '+y; }
  shiftMonth(delta){ const [y,m]=this.state.dpMonth.split('-').map(Number); const d=new Date(y,m-1+delta,1); this.setState({dpMonth:this.iso(d).slice(0,7)}); }
  pickDay(key){
    const S=this.state;
    if(!S.dpStart||S.dpEnd) this.setState({dpStart:key,dpEnd:null});
    else if(key<S.dpStart) this.setState({dpStart:key,dpEnd:S.dpStart});
    else this.setState({dpEnd:key});
  }
  applyRange(){ const S=this.state; this.setState(s=>({ dpOpen:false, ordFilters:Object.assign({},s.ordFilters,{from:S.dpStart||'',to:S.dpEnd||S.dpStart||''}) })); }
  setRange(from,to){ this.setState(s=>({ dpOpen:false, dpStart:from, dpEnd:to, dpMonth:from.slice(0,7), ordFilters:Object.assign({},s.ordFilters,{from:from,to:to}) })); }
  rangeShortcuts(){
    const t=new Date(); const iso=d=>this.iso(d);
    const day=n=>{ const d=new Date(t); d.setDate(d.getDate()-n); return d; };
    return [
      ['Aujourd\u2019hui',iso(t),iso(t)],
      ['7 derniers jours',iso(day(6)),iso(t)],
      ['30 derniers jours',iso(day(29)),iso(t)],
      ['Ce mois-ci',iso(new Date(t.getFullYear(),t.getMonth(),1)),iso(t)],
      ['Le mois dernier',iso(new Date(t.getFullYear(),t.getMonth()-1,1)),iso(new Date(t.getFullYear(),t.getMonth(),0))],
      ['Cette année',iso(new Date(t.getFullYear(),0,1)),iso(t)],
      ['L\u2019année dernière',iso(new Date(t.getFullYear()-1,0,1)),iso(new Date(t.getFullYear()-1,11,31))]
    ];
  }
  buildCalendar(){
    const S=this.state, [y,m]=S.dpMonth.split('-').map(Number);
    const startIdx=(new Date(y,m-1,1).getDay()+6)%7;
    const daysIn=new Date(y,m,0).getDate();
    const count=Math.ceil((startIdx+daysIn)/7)*7;
    const a=S.dpStart, b=S.dpEnd, todayKey=this.iso(new Date());
    const cells=[];
    for(let i=0;i<count;i++){
      const d=new Date(y,m-1,1-startIdx+i), key=this.iso(d), out=d.getMonth()!==m-1;
      const isA=key===a, isB=key===b, inRange=a&&b&&key>a&&key<b;
      let bg='transparent', fg=out?'var(--text-3)':'var(--text)', weight=out?'500':'600', radius='11px';
      if(inRange){ bg='var(--primary-soft)'; fg='var(--primary-2)'; radius='0'; }
      if(isA||isB){ bg='var(--primary)'; fg='#fff'; weight='700'; }
      cells.push({ label:String(d.getDate()), bg, fg, weight, radius,
        ring: (key===todayKey&&!isA&&!isB) ? '1px solid var(--border-2)' : '1px solid transparent',
        onClick:()=>this.pickDay(key) });
    }
    return cells;
  }
  setOrdFilter(k,v){ this.setState(s=>({ ordPage:1, ordFilters:Object.assign({},s.ordFilters,{[k]:v}) })); }

  /* ---------- partenaires & prospection ---------- */
  statusColor(status){
    const M={ 'À contacter':{bg:'var(--primary-softer)',fg:'var(--text-2)'}, 'Contacté':{bg:'var(--blue-soft)',fg:'var(--blue)'}, 'Relance':{bg:'var(--amber-soft)',fg:'var(--amber)'}, 'En négociation':{bg:'var(--primary-soft)',fg:'var(--primary-2)'}, 'Accepté':{bg:'var(--green-soft)',fg:'var(--green)'}, 'Refusé':{bg:'var(--neg-soft)',fg:'var(--neg)'} };
    return M[status]||M['À contacter'];
  }
  nextStatus(cur){ const arr=this.PROSPECT_STATUSES; const i=arr.indexOf(cur); return arr[(i+1)%arr.length]; }
  openPartner(name){ this.setState({selectedPartner:name}); }
  backToPartners(){ this.setState({selectedPartner:null}); }
  openThread(id){ this.setState({selectedProspectId:id}); }
  closeThread(){ this.setState({selectedProspectId:null}); }
  openProspectForm(){ this.setState({prospectFormOpen:true, prospectForm:{name:'',contact:''}}); }
  closeProspectForm(){ this.setState({prospectFormOpen:false}); }
  submitProspect(){
    const f=this.state.prospectForm;
    if(!f.name || !f.name.trim()) return;
    const added=new Date().toLocaleDateString('fr-FR');
    this.setState(s=>({
      prospects:[...s.prospects,{id:s.nextProspectId,name:f.name.trim(),contact:(f.contact||'—').trim()||'—',status:'À contacter',seq:false,added}],
      nextProspectId:s.nextProspectId+1,
      prospectFormOpen:false
    }));
  }
  cycleStatus(id){ this.setState(s=>({prospects:s.prospects.map(p=>p.id===id?Object.assign({},p,{status:this.nextStatus(p.status)}):p)})); }
  removeProspect(id){ this.setState(s=>({prospects:s.prospects.filter(p=>p.id!==id)})); }
  appendThreadMessage(id,subject,body){
    const date=new Date().toLocaleDateString('fr-FR');
    this.setState(s=>{
      const threads=Object.assign({},s.threads);
      threads[id]=[...(threads[id]||[]),{from:'me',date,subject,body}];
      return {threads};
    });
  }
  sendThreadReply(){
    const id=this.state.selectedProspectId;
    const f=this.state.threadReply;
    if(!id||!f.body||!f.body.trim()) return;
    this.appendThreadMessage(id,f.subject||'(Sans objet)',f.body.trim());
    this.setState({threadReply:{subject:'',body:''}});
  }

  /* ---------- idées / brainstorming ---------- */
  /** Ce qu'on affiche d'une idee en une ligne, selon ce qu'elle contient. */
  libelleIdee(it){
    if(it.type==='link') return this.domainOf(it.url)||it.url;
    if(it.type==='video') return it.videoName||'Vidéo';
    return it.text||'';
  }
  fmtIdeaTime(ts){ const d=new Date(ts); return d.toLocaleDateString('fr-FR',{day:'2-digit',month:'2-digit'})+' · '+d.toLocaleTimeString('fr-FR',{hour:'2-digit',minute:'2-digit'}); }
  domainOf(url){ try{ return new URL(url).hostname.replace('www.',''); }catch(e){ return url; } }
  addIdea(){
    const txt=(this.state.composerText||'').trim();
    if(!txt) return;
    const isLink=/^https?:\/\/\S+$/i.test(txt);
    const id=this.state.nextIdeaId;
    const contenu=isLink?{type:'link',url:txt}:{type:'text',text:txt};
    const api=window_donnees;
    if(api){
      // On vide le champ tout de suite : l'ecoute ramenera l'idee d'elle-meme.
      this.setState({composerText:''});
      api.ajouterIdee(contenu).catch(err=>{
        console.error('Idee non enregistree', err);
        this.setState({composerText:txt, ideasErr:"L'idée n'a pas pu être enregistrée."});
      });
      return;
    }
    const item=Object.assign({id,pinned:false,createdAt:Date.now()},contenu);
    this.setState(s=>({ideas:[item,...s.ideas],nextIdeaId:s.nextIdeaId+1,composerText:''}));
  }
  removeIdea(id){
    const api=window_donnees;
    if(api){
      const idee=this.state.ideas.find(i=>i.id===id);
      if(idee) api.supprimerIdee(idee).catch(err=>{
        console.error('Suppression impossible', err);
        this.setState({ideasErr:"L'idée n'a pas pu être supprimée."});
      });
      return;
    }
    this.setState(s=>({ideas:s.ideas.filter(i=>i.id!==id)}));
  }
  togglePinIdea(id){
    const api=window_donnees;
    if(api){
      const idee=this.state.ideas.find(i=>i.id===id);
      if(idee) api.marquerIdee(id,!idee.pinned).catch(err=>{
        console.error('Marquage impossible', err);
        this.setState({ideasErr:"Le marquage n'a pas pu être enregistré."});
      });
      return;
    }
    this.setState(s=>({ideas:s.ideas.map(i=>i.id===id?Object.assign({},i,{pinned:!i.pinned}):i)}));
  }
  onDragOver(e){ e.preventDefault(); if(!this.state.dragOver) this.setState({dragOver:true}); }
  onDragLeave(){ this.setState({dragOver:false}); }
  onDrop(e){
    e.preventDefault();
    this.setState({dragOver:false});
    const files=Array.from((e.dataTransfer&&e.dataTransfer.files)||[]).filter(f=>f.type.indexOf('video/')===0);
    files.forEach(f=>this.addVideoIdea(f));
  }
  onBrowseClick(){ if(this.fileInputRef.current) this.fileInputRef.current.click(); }
  onFilePicked(e){
    const files=Array.from(e.target.files||[]);
    files.forEach(f=>this.addVideoIdea(f));
    e.target.value='';
  }
  addVideoIdea(file){
    const api=window_donnees;
    if(api){
      this.setState({ideasEnvoi:0, ideasErr:null});
      api.ajouterIdeeVideo(file, pct=>this.setState({ideasEnvoi:pct}))
        .then(()=>this.setState({ideasEnvoi:null}))
        .catch(err=>{
          console.error('Envoi de la video interrompu', err);
          this.setState({ideasEnvoi:null, ideasErr:"La vidéo n'a pas pu être envoyée."});
        });
      return;
    }
    const url=URL.createObjectURL(file);
    const id=this.state.nextIdeaId;
    const item={id,type:'video',videoUrl:url,videoName:file.name,pinned:false,createdAt:Date.now(),stored:false};
    this.setState(s=>({ideas:[item,...s.ideas],nextIdeaId:s.nextIdeaId+1}));
    setTimeout(()=>{ this.setState(s=>({ideas:s.ideas.map(i=>i.id===id?Object.assign({},i,{stored:true}):i)})); },1400);
  }
  toggleDictation(){
    const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
    if(!SR) return;
    if(this.state.isRecording){ if(this.recognition) this.recognition.stop(); return; }
    const rec=new SR();
    rec.lang='fr-FR'; rec.continuous=true; rec.interimResults=false;
    let finalText='';
    rec.onresult=(e)=>{ for(let i=e.resultIndex;i<e.results.length;i++){ if(e.results[i].isFinal) finalText+=e.results[i][0].transcript+' '; } };
    rec.onend=()=>{ this.setState({isRecording:false}); this.recognition=null; const raw=finalText.trim(); if(raw) this.processDictation(raw); };
    rec.onerror=(e)=>{ this.setState({isRecording:false, micError:(e&&e.error==='not-allowed')?"Micro refusé — autorise l'accès dans ton navigateur.":"Le micro n'a pas pu être activé ici."}); this.recognition=null; };
    this.recognition=rec;
    this.setState({isRecording:true, micError:null});
    rec.start();
  }
  async processDictation(raw){
    this.setState({aiProcessing:true});
    try{
      const prompt="Voici une idée de vidéo dictée à l'oral par une créatrice de contenu TikTok Shop, de façon brute et décousue. Réécris-la en un script d'idée clair, concis et actionnable en français (3 à 5 phrases maximum), sans intro ni commentaire, juste le texte final:\n\n"+raw;
      const result=await window_claude.complete(prompt);
      this.setState(s=>({composerText:(s.composerText?s.composerText+'\n\n':'')+(result||raw).trim(),aiProcessing:false}));
    }catch(err){
      this.setState(s=>({composerText:(s.composerText?s.composerText+'\n\n':'')+raw,aiProcessing:false}));
    }
  }

  fmtTaille(b){ if(!b) return '—'; if(b>=1073741824) return (b/1073741824).toFixed(1).replace('.',',')+' Go'; if(b>=1048576) return Math.round(b/1048576)+' Mo'; return Math.round(b/1024)+' Ko'; }
  fmtDuree(s){ if(!s) return null; const m=Math.floor(s/60), r=Math.round(s%60); return m+':'+(r<10?'0':'')+r; }
  ilYA(ts){
    const d=Math.floor((Date.now()-ts)/60000);
    if(d<60) return 'il y a '+Math.max(1,d)+' min';
    if(d<1440) return 'il y a '+Math.floor(d/60)+' h';
    return 'il y a '+Math.floor(d/1440)+' j';
  }

  /* ---------- vidéos (bibliothèque) ---------- */
  VID_STATUSES(){ return ['À monter','En cours de modifs','Prête à poster','Postée']; }
  vidStatusColor(st){
    const M={
      'À monter':{bg:'#F1F0F5',fg:'var(--text-2)'},
      'En cours de modifs':{bg:'var(--amber-soft)',fg:'var(--amber)'},
      'Prête à poster':{bg:'var(--blue-soft)',fg:'var(--blue)'},
      'Postée':{bg:'var(--green-soft)',fg:'var(--green)'}
    };
    return M[st]||M['À monter'];
  }
  vidChildren(){
    const S=this.state, q=S.vidQuery.trim().toLowerCase();
    let arr=S.vidItems.filter(i=>i.parent===S.vidFolder);
    if(q) arr=S.vidItems.filter(i=>i.name.toLowerCase().indexOf(q)>=0);
    if(S.vidFilter!=='Tous') arr=arr.filter(i=>i.kind==='folder'?false:i.status===S.vidFilter);
    return arr.sort((a,b)=>(a.kind===b.kind ? b.createdAt-a.createdAt : (a.kind==='folder'?-1:1)));
  }
  vidAddFiles(files){
    if(window_donnees) return this.bibEnvoyer(window_donnees.VIDEOS, this.state.vidFolder, files);
    if(!files.length) return;
    const items=files.map((f,k)=>{
      const id=this.state.vidNextId+k;
      const ext=(f.name.split('.').pop()||'').toUpperCase();
      const item={id,kind:'file',name:f.name,parent:this.state.vidFolder,createdAt:Date.now(),size:f.size,ext:ext,url:URL.createObjectURL(f),duration:null,status:'À monter'};
      const v=document.createElement('video');
      v.preload='metadata';
      v.onloadedmetadata=()=>{ const d=v.duration; this.setState(s=>({vidItems:s.vidItems.map(i=>i.id===id?Object.assign({},i,{duration:d}):i)})); };
      v.src=item.url;
      return item;
    });
    this.setState(s=>({vidItems:s.vidItems.concat(items),vidNextId:s.vidNextId+items.length,vidDrag:false}));
  }
  vidNewFolderFn(){
    if(window_donnees){
      const nom='Nouveau dossier '+(this.state.vidItems.filter(i=>i.kind==='folder').length+1);
      return this.bibNouveauDossier(window_donnees.VIDEOS, this.state.vidFolder, nom, 'vidRenameId', 'vidRenameVal');
    }
    const id=this.state.vidNextId;
    const n=this.state.vidItems.filter(i=>i.kind==='folder').length+1;
    this.setState(s=>({
      vidItems:s.vidItems.concat([{id,kind:'folder',name:'Nouveau dossier '+n,parent:s.vidFolder,createdAt:Date.now()}]),
      vidNextId:id+1, vidRenameId:id, vidRenameVal:'Nouveau dossier '+n
    }));
  }
  vidDelete(id){
    if(window_donnees) return this.bibSupprimer(window_donnees.VIDEOS, this.state.vidItems, id, 'vidPreviewId');
    this.setState(s=>{
      const t=s.vidItems.find(i=>i.id===id);
      if(t&&t.url) URL.revokeObjectURL(t.url);
      return {vidItems:s.vidItems.filter(i=>i.id!==id&&i.parent!==id), vidPreviewId:s.vidPreviewId===id?null:s.vidPreviewId};
    });
  }
  vidMove(id,parent){ if(id===parent) return;
    if(window_donnees){ this.setState({vidOverId:null});
      return window_donnees.deplacer(window_donnees.VIDEOS,id,parent).catch(e=>this.bibEchec(e,"Le déplacement n'a pas abouti.")); } this.setState(s=>({vidItems:s.vidItems.map(i=>i.id===id?Object.assign({},i,{parent:parent}):i), vidOverId:null})); }
  vidSaveName(){
    if(window_donnees){
      const id=this.state.vidRenameId, v=(this.state.vidRenameVal||'').trim();
      this.setState({vidRenameId:null});
      if(!v) return;
      return window_donnees.renommer(window_donnees.VIDEOS,id,v).catch(e=>this.bibEchec(e,"Le renommage n'a pas abouti."));
    }
    const id=this.state.vidRenameId, v=this.state.vidRenameVal.trim();
    if(!v) return this.setState({vidRenameId:null});
    this.setState(s=>({vidItems:s.vidItems.map(i=>i.id===id?Object.assign({},i,{name:v}):i), vidRenameId:null}));
  }
  vidSetStatus(id,st){
    if(window_donnees){ this.setState({vidMenuId:null});
      return window_donnees.changerStatut(window_donnees.VIDEOS,id,st).catch(e=>this.bibEchec(e,"Le statut n'a pas pu être changé.")); } this.setState(s=>({vidItems:s.vidItems.map(i=>i.id===id?Object.assign({},i,{status:st}):i), vidMenuId:null})); }

  /* ---------- assistant IA ---------- */
  allOrders(){ return this._ordersCache || (this._ordersCache = this.genOrders()); }

  dataDigest(){
    const S=this.state;
    const cur=this.periodeCourante();
    const orders=this.allOrders();
    const n1=v=>Math.round(v*10)/10;
    const rate=o=>o.ca?n1(o.com/o.ca*100):0;

    const months={};
    orders.forEach(o=>{
      const m=o.dateKey.slice(0,7);
      const b=months[m]||(months[m]={n:0,gmv:0,com:0});
      b.n++; b.gmv+=o.gmv; b.com+=o.com;
    });
    const monthKeys=Object.keys(months).sort();
    const lastMonth=monthKeys[monthKeys.length-1];

    const perStatus={};
    orders.forEach(o=>{ perStatus[o.statut]=(perStatus[o.statut]||0)+1; });

    const prodMonth={};
    orders.filter(o=>o.dateKey.slice(0,7)===lastMonth).forEach(o=>{
      const b=prodMonth[o.produit]||(prodMonth[o.produit]={n:0,gmv:0,com:0,vendeur:o.vendeur});
      b.n++; b.gmv+=o.gmv; b.com+=o.com;
    });

    const L=[];
    L.push('# PROFIL');
    const compte=(this.props.user&&this.props.user.email)||S.profile.name;
    L.push('Créatrice : '+compte+'. Marché : France, TikTok Shop affiliation.');
    // Date calculee, pas ecrite en dur : un assistant qui se croit en aout 2026
    // alors qu'on est en octobre raconte n'importe quoi sur « ce mois-ci ».
    const now=new Date();
    L.push('Date du jour : '+this.frDate(this.iso(now))+'. Mois en cours = '+this.iso(now).slice(0,7)+'.');
    L.push('');
    L.push('# PERIODE SELECTIONNEE DANS L\'OUTIL : '+(S.customRange ? (S.customRange.from+' → '+S.customRange.to) : cur.label));
    L.push('CA '+cur.ca+' € | Commissions '+cur.com+' € | Commandes '+cur.orders+' | Réglées '+cur.reglees+' | En attente '+cur.attente+' | Inéligibles '+cur.ineligibles);
    L.push('');
    // Tout ce qui suit est calcule depuis les commandes de la periode. Les
    // tableaux de demonstration ne doivent JAMAIS partir au modele : il
    // raisonnerait avec aplomb sur des marques et des produits inexistants.
    if(this.enLigne()){
      const api=window_donnees;
      const top=(liste,cle,combien)=>liste.slice().sort((a,b)=>b[cle]-a[cle]).slice(0,combien);
      L.push('Les vues TikTok ne sont pas disponibles : ne raisonne pas dessus et ne les invente pas.');
      L.push('');
      L.push('# MARQUES (sur la période) — nom | commandes | CA € | commissions € | taux com % | panier moyen €');
      top(api.parVendeur(orders),'ca',20).forEach(b=>L.push(b.name+' | '+b.orders+' | '+n1(b.ca)+' | '+n1(b.com)+' | '+n1(b.taux)+' | '+n1(b.panier)));
      L.push('');
      L.push('# PRODUITS (sur la période) — nom | marque | commandes | CA € | commissions € | taux com % | panier €');
      top(api.parProduit(orders),'ca',30).forEach(p=>L.push(p.name+' | '+p.boutique+' | '+p.orders+' | '+n1(p.ca)+' | '+n1(p.com)+' | '+n1(p.taux)+' | '+n1(p.panier)));
      L.push('');
      L.push('# VIDEOS (sur la période) — produit | url | commandes | CA € | commissions €');
      top(api.parVideo(orders),'ca',20).forEach(v=>L.push(v.titre+' | '+v.url+' | '+v.orders+' | '+n1(v.ca)+' | '+n1(v.com)));
    } else {
      L.push('# MARQUES (cumul) — nom | commandes | CA € | commissions € | taux com % | panier moyen € | vues');
      this.BRANDS.forEach(b=>L.push(b.name+' | '+b.orders+' | '+b.ca+' | '+b.com+' | '+rate(b)+' | '+b.panier+' | '+b.vues));
      L.push('');
      L.push('# PRODUITS (cumul) — nom | marque | commandes | CA € | commissions € | taux com % | panier € | vues');
      this.PRODUCTS.forEach(p=>L.push(p.name+' | '+p.boutique+' | '+p.orders+' | '+p.ca+' | '+p.com+' | '+rate(p)+' | '+p.panier+' | '+p.vues));
      L.push('');
      L.push('# VIDEOS — titre | produit | commandes | CA € | commissions € | vues | conv % | € par 1000 vues');
      this.VIDEOS.forEach(v=>L.push(v.titre+' | '+v.produit+' | '+v.orders+' | '+v.ca+' | '+v.com+' | '+v.vues+' | '+n1(v.orders/v.vues*100)+' | '+n1(v.ca/v.vues*1000)));
    }
    L.push('');
    L.push('# TOUT L\'HISTORIQUE, mois par mois — mois | commandes | GMV € | commissions €');
    if(this._resume && this._resume.length){
      this._resume.forEach(m=>L.push(m.mois+' | '+m.nb+' | '+n1(m.ca)+' | '+n1(m.com)));
      const tot=this._resume.reduce((a,m)=>({nb:a.nb+m.nb,ca:a.ca+m.ca,com:a.com+m.com}),{nb:0,ca:0,com:0});
      L.push('TOTAL depuis le debut : '+tot.nb+' commandes | '+n1(tot.ca)+' € | '+n1(tot.com)+' €');
      L.push("Le detail par marque, produit et video ci-dessus ne porte QUE sur la periode selectionnee, pas sur tout l'historique. Ne confonds pas les deux.");
    } else {
      monthKeys.forEach(m=>L.push(m+' | '+months[m].n+' | '+n1(months[m].gmv)+' | '+n1(months[m].com)));
    }
    L.push('Statuts (toutes commandes) : '+Object.keys(perStatus).map(k=>k+' '+perStatus[k]).join(', '));
    L.push('');
    L.push('# COMMANDES DU MOIS EN COURS ('+lastMonth+') par produit — produit | marque | nb | GMV € | commissions €');
    Object.keys(prodMonth).sort((a,b)=>prodMonth[b].com-prodMonth[a].com).forEach(k=>{
      const b=prodMonth[k]; L.push(k+' | '+b.vendeur+' | '+b.n+' | '+n1(b.gmv)+' | '+n1(b.com));
    });
    L.push('');
    L.push('# VIDEOS EN PRODUCTION — nom | statut');
    if(this.enLigne()){
      S.vidItems.filter(v=>v.kind==='file'&&v.status!=='Postée')
        .forEach(v=>L.push(v.name+' | '+v.status));
    } else {
      this.FILE.forEach(f=>L.push(f.titre+' | '+f.produit+' | '+f.statut));
    }
    L.push('');
    L.push('# IDEES NOTEES PAR LA CREATRICE');
    S.ideas.slice(0,8).forEach(i=>L.push('- '+(i.type==='text'?i.text:(i.type==='link'?'lien : '+i.url:'vidéo importée'))));
    return L.join('\n');
  }

  /**
   * Decoupe une reponse en segments pour un rendu structure.
   *
   * Le modele a pour consigne de repondre en trois temps : une phrase, des
   * puces chiffrees, une action. Rendre ces trois temps differemment vaut mieux
   * que les aplatir dans un pave : la ligne d'action est ce qu'on vient
   * chercher, elle merite de sauter aux yeux.
   */
  segmentsReponse(texte){
    const sortie=[];
    String(texte||'').split('\n').map(l=>l.trim()).filter(Boolean).forEach(ligne=>{
      const action=/^(à|a) faire\b/i.test(ligne);
      const puce=!action && /^[•\-*]\s*/.test(ligne);
      sortie.push({
        key:sortie.length,
        estAction:action, estPuce:puce, estTexte:!action && !puce,
        texte:ligne.replace(/^[•\-*]\s*/,'').replace(/^(à|a) faire\s*(aujourd['’]hui)?\s*:?\s*/i,'')
      });
    });
    return sortie;
  }

  /** Nombre de valeurs distinctes sur la periode chargee. */
  compteConnecte(cle){
    if(!this.enLigne()) return cle==='produit'?this.PRODUCTS.length:(cle==='vendeur'?this.BRANDS.length:this.VIDEOS.length);
    const vus=new Set();
    this.allOrders().forEach(o=>{ if(o[cle]) vus.add(o[cle]); });
    return vus.size;
  }

  /**
   * Resume mensuel de tout l'historique, charge une fois par session.
   *
   * Sans lui, l'assistant ne connait que la periode affichee et annonce deux
   * mille commandes quand le compte en compte dix fois plus.
   */
  chargerResume(){
    const api=window_donnees;
    if(!api || this._resumeDemande) return;
    this._resumeDemande = true;
    api.resumeMensuel()
      .then(r=>{ this._resume = r; this.forceUpdate(); })
      .catch(err=>console.error('Resume mensuel indisponible', err));
  }

  agentSystem(){
    return [
      "Tu es le conseiller data personnel d'une créatrice TikTok Shop, intégré à son outil Rekolt.",
      "Tu réponds en français, tutoiement, ton direct et chaleureux, jamais corporate.",
      "",
      "Règles :",
      "- Réponds TOUJOURS à partir des données ci-dessous. Cite les chiffres exacts (CA, commissions, taux, vues) qui justifient ton raisonnement.",
      "- Si une donnée n'existe pas dans le contexte, dis-le franchement au lieu d'inventer.",
      "- SOIS BREF. 80 mots maximum. C'est une contrainte stricte, pas une suggestion.",
      "- Structure imposée : une phrase de réponse directe, puis 2 puces chiffrées au maximum, puis une ligne « À faire : … ». Rien d'autre.",
      "- Pas de préambule (« Ok, parfait, je vais te… »), pas de reformulation de la question, pas de conclusion ni de relance (« Ça match ? »). Tu entres dans le vif immédiatement.",
      "- Une seule recommandation par réponse. Si tu hésites entre deux, choisis la meilleure et tais l'autre.",
      "- Raisonne comme un analyste : compare le taux de commission, le panier moyen, la conversion par vue et le volume — pas seulement le CA brut.",
      "- Pas de markdown lourd : pas de titres #, pas de gras. Puces avec « • ».",
      "",
      "=== DONNEES DU COMPTE ===",
      this.dataDigest()
    ].join('\n');
  }

  scrollChat(){ setTimeout(()=>{ if(this._chatEl) this._chatEl.scrollTop=this._chatEl.scrollHeight; },40); }

  async askAgent(text){
    const q=(text!=null?text:this.state.chatInput).trim();
    if(!q||this.state.chatBusy) return;
    const hist=this.state.chat.concat([{role:'user',content:q}]);
    this.setState({chat:hist,chatInput:'',chatBusy:true,chatErr:null});
    this.scrollChat();
    try{
      const out=await window_claude.complete({
        model: this.props.assistantModel==='Approfondi' ? 'claude-sonnet-4-5' : 'claude-haiku-4-5',
        max_tokens: 400,   // plafond assumé : une reponse longue est une reponse qui noie
        system: this.agentSystem(),
        messages: hist.slice(-8).map(m=>({role:m.role,content:m.content}))
      });
      const txt=(out||'').trim();
      this.setState(s=>({chat:s.chat.concat([{role:'assistant',content:txt||"Je n'ai pas de réponse pour ça."}]),chatBusy:false}));
    }catch(e){
      this.setState({chatBusy:false,chatErr:"L'assistant n'a pas pu répondre — réessaie dans quelques secondes."});
    }
    this.scrollChat();
  }

  /* ---------- sorting ---------- */
  toggleSort(table,key){
    const strKeys=['name','titre','produit','boutique'];
    this.setState(s=>{
      const cur=s.sort[table];
      let dir;
      if(cur.key===key) dir=cur.dir==='asc'?'desc':'asc';
      else dir=strKeys.indexOf(key)>=0?'asc':'desc';
      return {sort:Object.assign({},s.sort,{[table]:{key,dir}})};
    });
  }
  sortRows(arr,key,dir){
    const s=arr.slice().sort((a,b)=>{ const av=a[key],bv=b[key]; if(typeof av==='string') return av.localeCompare(bv,'fr'); return av-bv; });
    if(dir==='desc') s.reverse();
    return s;
  }
  sortUI(table,keys){
    const cur=this.state.sort[table], out={};
    keys.forEach(k=>{ const active=cur.key===k; out[k]={ color:active?'var(--primary)':'var(--text-3)', arrow:active?(cur.dir==='asc'?' ↑':' ↓'):'', onClick:()=>this.toggleSort(table,k) }; });
    return out;
  }

  renderVals(){
    const S=this.state;
    const cur=this.periodeCourante();
    const tiktok=this.props.tiktokConnected!==false;
    const setPage=id=>this.setState({page:id,periodOpen:false});

    const navItem=n=>{ const active=S.page===n.id; return { label:n.label, badge:n.badge, icon:this.iconEl(n.icon,19,active?2:1.8), bg:active?'var(--primary-soft)':'transparent', fg:active?'var(--primary-2)':'var(--text-2)', onClick:()=>setPage(n.id) }; };
    const navGroups=[
      {label:'Ton shop', items:[
        {id:'dashboard',label:'Dashboard',icon:'home'},
        {id:'analytics',label:'Analytics',icon:'chart'},
        {id:'commandes',label:'Commandes',icon:'bag'}
      ]},
      {label:'Ton studio', items:[
        {id:'idees',label:'Idées',icon:'bulb'},
        {id:'videos',label:'Vidéos',icon:'video'},
        {id:'rushs',label:'Rushs',icon:'film'}
      ]}
    ].map(g=>({label:g.label,items:g.items.map(navItem)}));
    const assistantOn=S.page==='assistant';
    const assistantItem={
      icon:this.iconEl('spark',19,assistantOn?2:1.9),
      onClick:()=>setPage('assistant'),
      bg:assistantOn?'linear-gradient(135deg,var(--primary),var(--secondary))':'var(--primary-soft)',
      fg:assistantOn?'#fff':'var(--primary-2)',
      border:assistantOn?'transparent':'var(--border-2)'
    };
    const settingsActive=S.page==='parametres';
    const deconnexionItem={
      label:S.deconnexionEnCours?'Déconnexion…':'Se déconnecter',
      icon:this.iconEl('logout',18,1.8),
      onClick:()=>this.seDeconnecter() };
    const settingsItem={ label:'Paramètres', icon:this.iconEl('settings',18,1.8), onClick:()=>setPage('parametres'), bg:settingsActive?'var(--primary-soft)':'#F4F3F7', fg:settingsActive?'var(--primary-2)':'var(--text-2)', border:settingsActive?'var(--border-2)':'var(--border)' };

    const periodOptions=this.PERIODS.map(p=>{ const active=p.id===S.period&&!S.customRange; return { label:p.label, active, bg:active?'var(--primary-soft)':'transparent', fg:active?'var(--primary-2)':'var(--text)', onClick:()=>this.setState({period:p.id,periodOpen:false,hoverIdx:null,customRange:null,dpStart:null,dpEnd:null}) }; });

    // dashboard KPIs
    const pairs={primary:['var(--primary-soft)','var(--primary-2)'],secondary:['var(--secondary-soft)','var(--secondary)'],blue:['var(--blue-soft)','var(--blue)'],amber:['var(--amber-soft)','var(--amber)'],green:['var(--green-soft)','var(--green)']};
    const dashKpis=[
      Object.assign({label:'CA Généré',value:this.fmtEur(cur.ca),icon:this.iconEl('euro',22),iconBg:pairs.primary[0],iconFg:pairs.primary[1]},this.trendObj(cur.caT)),
      Object.assign({label:'Commissions',value:this.fmtEur(cur.com),icon:this.iconEl('wallet',22),iconBg:pairs.secondary[0],iconFg:pairs.secondary[1]},this.trendObj(cur.comT)),
      Object.assign({label:'Commandes réglées',value:this.fmtNum(cur.reglees),icon:this.iconEl('bag',22),iconBg:pairs.blue[0],iconFg:pairs.blue[1],sub:cur.attente+' en attente · '+cur.ineligibles+' inéligibles'},this.trendObj(cur.ordT)),
      Object.assign({label:'Panier moyen',value:this.fmtEur(cur.panier,2),icon:this.iconEl('box',22),iconBg:pairs.amber[0],iconFg:pairs.amber[1]},this.trendObj(cur.panierT))
    ];

    // compte KPIs
    const tauxGlobal=cur.com/cur.ca*100;
    const compteKpis=[
      Object.assign({label:'CA',value:this.fmtEur(cur.ca),icon:this.iconEl('euro',21),iconBg:pairs.primary[0],iconFg:pairs.primary[1]},this.trendObj(cur.caT)),
      Object.assign({label:'Commissions',value:this.fmtEur(cur.com),icon:this.iconEl('wallet',21),iconBg:pairs.secondary[0],iconFg:pairs.secondary[1]},this.trendObj(cur.comT)),
      {label:'Taux de commission global',value:this.fmtPct(tauxGlobal,1),icon:this.iconEl('percent',21),iconBg:pairs.blue[0],iconFg:pairs.blue[1]},
      {label:'Commission par commande',value:this.fmtEur(cur.com/cur.reglees,2),icon:this.iconEl('wallet',21),iconBg:pairs.amber[0],iconFg:pairs.amber[1]},
      Object.assign({label:'Commandes réglées',value:this.fmtNum(cur.reglees),icon:this.iconEl('bag',21),iconBg:pairs.green[0],iconFg:pairs.green[1],sub:cur.attente+' en attente · '+cur.ineligibles+' inéligibles'},this.trendObj(cur.ordT)),
      Object.assign({label:'Panier moyen',value:this.fmtEur(cur.panier,2),icon:this.iconEl('box',21),iconBg:pairs.primary[0],iconFg:pairs.primary[1]},this.trendObj(cur.panierT))
    ];

    const total=cur.reglees+cur.attente+cur.ineligibles;
    const elig=(total-cur.ineligibles)/total*100;

    // top produits
    const topSorted=this.enLigne()
      ? ((this._dash && this._dash.cle===S.period) ? window_donnees.topProduits(this._dash.commandes, S.topMetric, 5) : [])
      : this.PRODUCTS.slice().sort((a,b)=>b[S.topMetric]-a[S.topMetric]).slice(0,5);
    const topProduits=topSorted.map((p,i)=>({ rank:i+1, name:this.tronquer(p.name,45), nameComplet:p.name, ventes:this.fmtNum(p.orders), amount:this.fmtEur(p[S.topMetric]), rankBg:i===0?'var(--primary)':'var(--primary-soft)', rankFg:i===0?'#fff':'var(--primary-2)' }));
    const topToggle={ ca:{onClick:()=>this.setState({topMetric:'ca'}),bg:S.topMetric==='ca'?'var(--card)':'transparent',fg:S.topMetric==='ca'?'var(--primary-2)':'var(--text-3)'}, com:{onClick:()=>this.setState({topMetric:'com'}),bg:S.topMetric==='com'?'var(--card)':'transparent',fg:S.topMetric==='com'?'var(--primary-2)':'var(--text-3)'} };

    // file de travail
    const statutMap={'À tourner':['var(--primary-soft)','var(--primary-2)'],'Script':['var(--blue-soft)','var(--blue)'],'À monter':['var(--amber-soft)','var(--amber)'],'À publier':['var(--green-soft)','var(--green)']};
    const fileDeTravail=this.FILE.map(f=>({titre:f.titre,produit:f.produit,statut:f.statut,badgeBg:statutMap[f.statut][0],badgeFg:statutMap[f.statut][1]}));

    // Pretes a poster, de la plus ancienne a la plus recente : c'est l'ordre
    // dans lequel on veut les publier, pas celui dans lequel on les a montees.
    const aPoster=S.vidItems
      .filter(v=>v.kind==='file' && v.status==='Prête à poster')
      .sort((a,b)=>a.createdAt-b.createdAt)
      .map(v=>({ nom:this.tronquer(v.name,52), nomComplet:v.name,
                 quand:this.fmtIdeaTime(v.createdAt), duree:this.fmtDuree(v.duration), ext:v.ext }));

    const ideesMarquees=S.ideas
      .filter(i=>i.pinned)
      .sort((a,b)=>b.createdAt-a.createdAt)
      .map(i=>{ const t=this.libelleIdee(i);
        return { libelle:this.tronquer(t,64), libelleComplet:t, quand:this.fmtIdeaTime(i.createdAt) }; });

    // tables
    // Les tableaux Analytics se calculent depuis les commandes de la periode
    // deja chargee pour le tableau de bord : aucune requete supplementaire, et
    // les chiffres ne peuvent pas diverger de ceux affiches au-dessus.
    const cmdPeriode=(this._dash && this._dash.cle===S.period) ? this._dash.commandes : null;
    const reel=this.enLigne();
    // Les vues viennent de l'API TikTok, pas des commandes : tant qu'elle n'est
    // pas branchee, on affiche un tiret plutot qu'un zero qui passerait pour une
    // vidéo sans audience.
    const sansVues=o=>Object.assign({vues:null},o);

    const rushKids=this.rushChildren();
    const rushFolderObj=S.rushFolder!=null?S.rushItems.find(i=>i.id===S.rushFolder):null;
    const rushPrev=S.rushPreviewId!=null?S.rushItems.find(i=>i.id===S.rushPreviewId):null;
    const marquesRaw=reel
      ? (cmdPeriode ? window_donnees.parVendeur(cmdPeriode).map(sansVues) : [])
      : this.BRANDS.map(b=>Object.assign({},b,{taux:b.com/b.ca*100}));
    const ms=S.sort.marques;
    const marquesRows=this.sortRows(marquesRaw,ms.key,ms.dir).map(b=>{ const t=this.tauxBadge(b.taux); return {name:b.name,orders:this.fmtNum(b.orders),ca:this.fmtEur(b.ca),com:this.fmtEur(b.com),tauxStr:this.fmtPct(b.taux,1),tauxBg:t.bg,tauxFg:t.fg,panier:this.fmtEur(b.panier,2)}; });
    const marquesSort=this.sortUI('marques',['name','orders','ca','com','taux','panier']);

    const prodRaw=reel
      ? (cmdPeriode ? window_donnees.parProduit(cmdPeriode).map(sansVues) : [])
      : this.PRODUCTS.map(p=>Object.assign({},p,{taux:p.com/p.ca*100}));
    const ps=S.sort.produits;
    const produitsRows=this.sortRows(prodRaw,ps.key,ps.dir).map(p=>{ const t=this.tauxBadge(p.taux); return {name:p.name,boutique:p.boutique,orders:this.fmtNum(p.orders),ca:this.fmtEur(p.ca),com:this.fmtEur(p.com),tauxStr:this.fmtPct(p.taux,1),tauxBg:t.bg,tauxFg:t.fg,panier:this.fmtEur(p.panier,2)}; });
    const produitsSort=this.sortUI('produits',['name','boutique','orders','ca','com','taux','panier']);

    const vidRaw=reel
      ? (cmdPeriode ? window_donnees.parVideo(cmdPeriode).map(v=>sansVues(Object.assign({},v,{conv:null,revvue:null}))) : [])
      : this.VIDEOS.map(v=>Object.assign({},v,{conv:v.orders/v.vues*100,revvue:v.ca/v.vues}));
    const vs=S.sort.videos;
    const videosRows=this.sortRows(vidRaw,vs.key,vs.dir).map(v=>{ const c=this.convBadge(v.conv); return {titre:v.titre,produit:v.produit,orders:this.fmtNum(v.orders),ca:this.fmtEur(v.ca),com:this.fmtEur(v.com),vues:this.fmtViews(v.vues),convStr:this.fmtPct(v.conv,2),convBg:c.bg,convFg:c.fg,revvue:this.fmtEur(v.revvue,3)}; });
    const videosSort=this.sortUI('videos',['titre','produit','orders','ca','com','vues','conv','revvue']);

    const tabs=[['compte','Compte'],['marques','Marques'],['produits','Produits'],['videos','Vidéos']];
    const analyticsTabs=tabs.map(t=>{ const active=S.tab===t[0]; return {label:t[1],onClick:()=>this.setState({tab:t[0]}),color:active?'var(--text)':'var(--text-3)',border:active?'var(--primary)':'transparent'}; });

    // partenaires
    const partnersBase=reel
      ? (cmdPeriode ? window_donnees.parPartenaire(cmdPeriode).map(sansVues) : [])
      : this.BRANDS.map(b=>Object.assign({},b,{taux:b.com/b.ca*100,nbProduits:this.PRODUCTS.filter(p=>p.boutique===b.name).length}));
    const pas=S.sort.partenaires;
    const partenairesRows=this.sortRows(partnersBase,pas.key,pas.dir).map(b=>{ const t=this.tauxBadge(b.taux); return { name:b.name, initial:b.name.charAt(0), nbProduits:b.nbProduits, orders:this.fmtNum(b.orders), ca:this.fmtEur(b.ca), com:this.fmtEur(b.com), tauxStr:this.fmtPct(b.taux,1), tauxBg:t.bg, tauxFg:t.fg, vues:this.fmtViews(b.vues), onClick:()=>this.openPartner(b.name) }; });
    const partenairesSort=this.sortUI('partenaires',['name','nbProduits','orders','ca','com','taux','vues']);

    const selBrand=this.BRANDS.find(b=>b.name===S.selectedPartner);
    const partnerProductsRaw=selBrand? this.PRODUCTS.filter(p=>p.boutique===selBrand.name).map(p=>Object.assign({},p,{taux:p.com/p.ca*100})) : [];
    const ppSort=S.sort.partnerProducts;
    const partnerProductsRows=this.sortRows(partnerProductsRaw,ppSort.key,ppSort.dir).map(p=>{ const t=this.tauxBadge(p.taux); return {name:p.name,orders:this.fmtNum(p.orders),ca:this.fmtEur(p.ca),com:this.fmtEur(p.com),tauxStr:this.fmtPct(p.taux,1),tauxBg:t.bg,tauxFg:t.fg,vues:this.fmtViews(p.vues)}; });
    const partnerProductsSort=this.sortUI('partnerProducts',['name','orders','ca','com','taux','vues']);
    const partnerKpis=selBrand?[
      {label:'CA généré',value:this.fmtEur(selBrand.ca),icon:this.iconEl('euro',21),iconBg:pairs.primary[0],iconFg:pairs.primary[1]},
      {label:'Commissions',value:this.fmtEur(selBrand.com),icon:this.iconEl('wallet',21),iconBg:pairs.secondary[0],iconFg:pairs.secondary[1]},
      {label:'Commandes',value:this.fmtNum(selBrand.orders),icon:this.iconEl('bag',21),iconBg:pairs.blue[0],iconFg:pairs.blue[1]},
      {label:'Vues',value:this.fmtViews(selBrand.vues),icon:this.iconEl('tiktok',21),iconBg:pairs.amber[0],iconFg:pairs.amber[1]}
    ]:[];

    // commandes
    if(!this.ORDERS) this.ORDERS=this.genOrders();
    const F=S.ordFilters;
    const uniques=(cle,defaut)=> this._commandes
      ? Array.from(new Set(this.ORDERS.map(o=>o[cle]))).filter(Boolean).sort((a,b)=>a.localeCompare(b,'fr'))
      : defaut;
    const vendeurOptions=['Tous les vendeurs'].concat(uniques('vendeur',this.BRANDS.map(b=>b.name)));
    const statutOptions=['Tous les statuts'].concat(uniques('statut',['Réglée','En attente','Inéligible','Remboursée']));
    const filtered=this.ORDERS.filter(o=>
      (F.vendeur==='Tous les vendeurs'||o.vendeur===F.vendeur) &&
      (F.statut==='Tous les statuts'||o.statut===F.statut) &&
      (!F.from||o.dateKey>=F.from) && (!F.to||o.dateKey<=F.to));
    const cs=S.sort.commandes;
    const triees=this.sortRows(filtered,cs.key,cs.dir);

    // Le tableau n'affiche qu'une page ; les totaux ci-dessous restent calcules
    // sur `filtered`, c'est-a-dire la periode entiere. Un total qui ne porterait
    // que sur les 30 lignes visibles serait faux sans en avoir l'air.
    const parPage=30;
    const nbPages=Math.max(1,Math.ceil(triees.length/parPage));
    const pageCourante=Math.min(Math.max(1,S.ordPage||1),nbPages);
    const debut=(pageCourante-1)*parPage;
    const visibles=triees.slice(debut,debut+parPage);

    const commandesRows=visibles.map(o=>{ const c=this.orderStatusColor(o.statut); return {
      date:o.dateLabel, produit:this.tronquer(o.produit,70), produitComplet:o.produit, vendeur:o.vendeur, statut:o.statut, statutBg:c.bg, statutFg:c.fg,
      gmv:this.fmtEur(o.gmv,2), com:this.fmtEur(o.com,2) }; });
    const cmdSort=this.sortUI('commandes',['dateKey','produit','vendeur','statut','gmv','com']);
    // Une commande inéligible ne sera jamais payée : elle reste dans le tableau
    // et dans le compte, mais pas dans les montants. Le nombre exclu est
    // affiché, sinon l'addition mentale de la colonne GMV ne tomberait pas sur
    // le total — et c'est ce genre d'écart silencieux qui fait douter du reste.
    const retenues=filtered.filter(o=>o.statut!=='Inéligible');
    const nbInel=filtered.length-retenues.length;
    const totGmv=retenues.reduce((a,o)=>a+o.gmv,0), totCom=retenues.reduce((a,o)=>a+o.com,0);
    const noteInel=nbInel?this.fmtNum(nbInel)+' inéligible'+(nbInel>1?'s':'')+' exclue'+(nbInel>1?'s':''):null;
    const ordersKpis=[
      {label:'Commandes',value:this.fmtNum(filtered.length)},
      {label:'GMV total',value:this.fmtEur(totGmv,2),sub:noteInel},
      {label:'Commissions',value:this.fmtEur(totCom,2),sub:noteInel}
    ];
    const pagination={
      visible: triees.length>parPage,
      resume: this.fmtNum(debut+1)+'–'+this.fmtNum(Math.min(debut+parPage,triees.length))+' sur '+this.fmtNum(triees.length),
      page: 'Page '+pageCourante+' / '+nbPages,
      precOp: pageCourante<=1?'0.4':'1', precPe: pageCourante<=1?'none':'auto',
      suivOp: pageCourante>=nbPages?'0.4':'1', suivPe: pageCourante>=nbPages?'none':'auto',
      prec:()=>this.setState(s=>({ordPage:Math.max(1,(s.ordPage||1)-1)})),
      suiv:()=>this.setState(s=>({ordPage:(s.ordPage||1)+1}))
    };

    // prospection
    const prospectRows=S.prospects.map(p=>{ const c=this.statusColor(p.status); return {
      name:p.name, contact:p.contact, status:p.status, statusBg:c.bg, statusFg:c.fg, cycleStatus:()=>this.cycleStatus(p.id),
      msgCount:(S.threads[p.id]||[]).length,
      openThread:()=>this.openThread(p.id),
      added:p.added, remove:()=>this.removeProspect(p.id)
    }; });
    const prospectForm={ name:S.prospectForm.name, contact:S.prospectForm.contact,
      onName:e=>this.setState(s=>({prospectForm:Object.assign({},s.prospectForm,{name:e.target.value})})),
      onContact:e=>this.setState(s=>({prospectForm:Object.assign({},s.prospectForm,{contact:e.target.value})})) };

    const selProspect=S.prospects.find(p=>p.id===S.selectedProspectId);
    const rawThread=selProspect?(S.threads[selProspect.id]||[]):[];
    const threadMessages=rawThread.map(m=>{
      const mine=m.from==='me';
      return {
        align:mine?'flex-end':'flex-start',
        bg:mine?'var(--primary)':'var(--card)',
        fg:mine?'#fff':'var(--text)',
        radius:mine?'14px 14px 4px 14px':'14px 14px 14px 4px',
        border:mine?'':'border:1px solid var(--border);',
        who:mine?'Toi':selProspect.name,
        date:m.date, subject:m.subject, body:m.body
      };
    });

    // idées
    const ideasSorted=S.ideas.slice().sort((a,b)=>(b.pinned-a.pinned)||(b.createdAt-a.createdAt));
    const cardBgCycle=['var(--primary-soft)','var(--secondary-soft)','var(--amber-soft)','var(--blue-soft)','var(--green-soft)'];
    const ideaCards=ideasSorted.map((it,i)=>{
      const base={
        isText:it.type==='text', isLink:it.type==='link', isVideo:it.type==='video',
        bg:cardBgCycle[i%cardBgCycle.length], time:this.fmtIdeaTime(it.createdAt),
        onRemove:()=>this.removeIdea(it.id), onPin:()=>this.togglePinIdea(it.id),
        pinBg:it.pinned?'var(--amber-soft)':'rgba(255,255,255,0.7)', pinFg:it.pinned?'var(--amber)':'var(--text-3)',
        // Pleine quand l'idee est marquee, en contour sinon : l'etat se lit sans
        // avoir a comparer deux nuances de fond.
        pinIcon:this.iconEl('star',13,2,it.pinned?'currentColor':null)
      };
      if(it.type==='text') return Object.assign(base,{text:it.text});
      if(it.type==='link') return Object.assign(base,{url:it.url,domain:this.domainOf(it.url)});
      if(it.type==='video') return Object.assign(base,{isVideo:!!it.videoUrl,videoUrl:it.videoUrl,videoName:it.videoName,
        storeLabel:it.stored?'Stockée':'Envoi en cours…', storeBg:it.stored?'var(--green-soft)':'var(--amber-soft)', storeFg:it.stored?'var(--green)':'var(--amber)',
        storeIcon:this.iconEl(it.stored?'check':'send',11,2.4)});
      return base;
    });
    const speechSupported=!!(typeof window!=='undefined'&&(window.SpeechRecognition||window.webkitSpeechRecognition));
    const viewToggle={
      pinterest:{onClick:()=>this.setState({view:'pinterest'}),bg:S.view==='pinterest'?'var(--card)':'transparent',fg:S.view==='pinterest'?'var(--primary-2)':'var(--text-3)'},
      list:{onClick:()=>this.setState({view:'list'}),bg:S.view==='list'?'var(--card)':'transparent',fg:S.view==='list'?'var(--primary-2)':'var(--text-3)'}
    };

    const meta=this.PAGES[S.page]||this.PAGES.dashboard;
    const vidKids=this.vidChildren();
    const vidFolderObj=S.vidFolder!=null?S.vidItems.find(i=>i.id===S.vidFolder):null;
    const vidPrev=S.vidPreviewId!=null?S.vidItems.find(i=>i.id===S.vidPreviewId):null;

    return {
      rootRef:this.rootRef,
      settingsItem,
      pageTitle:meta.title, pageSubtitle:meta.sub,
      tableauDeBord:{
        visible: !!(S.dashErr || S.dashLoading || (this._dash && this._dash.cle===S.period && this._dash.totaux.orders===0)),
        texte: S.dashErr
          ? S.dashErr
          : S.dashLoading
            ? 'Chargement des indicateurs…'
            : 'Aucune commande sur cette période. Les indicateurs restent à zéro tant qu’aucun import ne la couvre.',
        bg: S.dashErr?'var(--neg-soft)':'var(--primary-softer)',
        fg: S.dashErr?'var(--neg)':'var(--text-2)'
      },
      // Cinq onglets au maximum : au-dela, les libelles se chevauchent sur un
      // ecran de 375px. Les quatre destinations les plus frequentes restent
      // accessibles d'un geste, le reste passe dans une feuille.
      onglets:[
        {id:'dashboard',label:'Accueil',icon:'home'},
        {id:'commandes',label:'Commandes',icon:'bag'},
        {id:'analytics',label:'Analytics',icon:'chart'},
        {id:'videos',label:'Vidéos',icon:'video'}
      ].map(o=>({
        label:o.label,
        icon:this.iconEl(o.icon,21,S.page===o.id?2.1:1.8),
        fg:S.page===o.id?'var(--primary-2)':'var(--text-3)',
        onClick:()=>this.setState({page:o.id,menuMobileOuvert:false,periodOpen:false})
      })).concat([{
        label:'Plus',
        icon:this.iconEl('list',21,1.9),
        fg:S.menuMobileOuvert?'var(--primary-2)':'var(--text-3)',
        onClick:()=>this.setState(x=>({menuMobileOuvert:!x.menuMobileOuvert}))
      }]),
      ongletsPlus:[
        {id:'idees',label:'Idées',icon:'bulb'},
        {id:'rushs',label:'Rushs',icon:'film'},
        {id:'assistant',label:'Ton assistant perso',icon:'spark'},
        {id:'parametres',label:'Paramètres',icon:'settings'}
      ].map(o=>({
        label:o.label, icon:this.iconEl(o.icon,20,1.9),
        bg:S.page===o.id?'var(--primary-soft)':'transparent',
        fg:S.page===o.id?'var(--primary-2)':'var(--text-2)',
        onClick:()=>this.setState({page:o.id,menuMobileOuvert:false,periodOpen:false})
      })),
      menuMobileOuvert:S.menuMobileOuvert,
      fermerMenuMobile:()=>this.setState({menuMobileOuvert:false}),
      compte:this.carteCompte(),
      profil:{
        visible: !!(S.profilErr || S.profilEnvoi),
        texte: S.profilErr || 'Envoi de la photo…',
        bg: S.profilErr?'var(--neg-soft)':'var(--primary-softer)',
        fg: S.profilErr?'var(--neg)':'var(--text-2)'
      },
      vrai:true,
      dashPret:this.dashPret(), dashOccupe:!this.dashPret(),
      idees:{
        visible: !!(S.ideasErr || S.ideasEnvoi!==null),
        texte: S.ideasErr || ('Envoi de la vidéo… '+S.ideasEnvoi+' %'),
        bg: S.ideasErr?'var(--neg-soft)':'var(--primary-softer)',
        fg: S.ideasErr?'var(--neg)':'var(--text-2)'
      },
      bibliotheque:{
        visible: !!(S.bibErr || S.bibEnvoi!==null),
        texte: S.bibErr || ('Envoi en cours… '+S.bibEnvoi+' %'),
        bg: S.bibErr?'var(--neg-soft)':'var(--primary-softer)',
        fg: S.bibErr?'var(--neg)':'var(--text-2)'
      },
      isDashboard:S.page==='dashboard', isAnalytics:S.page==='analytics',
      isRushs:S.page==='rushs',
      rushQuery:S.rushQuery,
      onRushQuery:e=>this.setState({rushQuery:e.target.value}),
      rushIsGrid:S.rushView==='grid'&&rushKids.length>0,
      rushIsList:S.rushView==='list'&&rushKids.length>0,
      rushEmpty:rushKids.length===0,
      rushGridBtn:{onClick:()=>this.setState({rushView:'grid'}),bg:S.rushView==='grid'?'var(--card)':'transparent',fg:S.rushView==='grid'?'var(--primary-2)':'var(--text-3)'},
      rushListBtn:{onClick:()=>this.setState({rushView:'list'}),bg:S.rushView==='list'?'var(--card)':'transparent',fg:S.rushView==='list'?'var(--primary-2)':'var(--text-3)'},
      rushInFolder:!!rushFolderObj, rushFolderName:rushFolderObj?rushFolderObj.name:'',
      rushRootFg:rushFolderObj?'var(--text-3)':'var(--text)',
      rushGoRoot:()=>this.setState({rushFolder:null,rushQuery:''}),
      rushNewFolder:()=>this.rushNewFolderFn(),
      rushInputRef:this.rushRef||(this.rushRef=React.createRef()),
      rushBrowse:()=>this.rushRef.current&&this.rushRef.current.click(),
      onRushPick:e=>{ this.rushAddFiles(Array.from(e.target.files||[])); e.target.value=''; },
      onRushDragOver:e=>{ e.preventDefault(); if(!S.rushDrag) this.setState({rushDrag:true}); },
      onRushDragLeave:e=>{ e.preventDefault(); this.setState({rushDrag:false}); },
      onRushDrop:e=>{
        e.preventDefault();
        const files=Array.from((e.dataTransfer&&e.dataTransfer.files)||[]).filter(f=>f.type.indexOf('video/')===0||/\.(mp4|mov|avi|mkv|webm|m4v|mpg|mpeg|wmv|flv)$/i.test(f.name));
        this.setState({rushDrag:false});
        if(files.length) this.rushAddFiles(files);
      },
      rushDropBorder:S.rushDrag?'var(--primary)':'var(--border-2)',
      rushDropBg:S.rushDrag?'var(--primary-softer)':'transparent',
      rushCards:rushKids.map(it=>{
        const isFolder=it.kind==='folder';
        const over=S.rushOverId===it.id;
        const count=isFolder?S.rushItems.filter(x=>x.parent===it.id).length:0;
        const dur=this.fmtDuree(it.duration);
        const meta=isFolder
          ? (count?count+(count>1?' éléments':' élément'):'Vide')+' · '+this.ilYA(it.createdAt)
          : [it.ext,dur,this.fmtTaille(it.size),this.ilYA(it.createdAt)].filter(Boolean).join(' · ');
        return {
          key:it.id, name:it.name, meta:meta,
          draggable:true,
          border:over?'var(--primary)':'var(--border)',
          rowAccent:over?'var(--primary)':'transparent',
          thumbBg:isFolder?'var(--primary-soft)':'#0E0A1A',
          thumbFg:isFolder?'var(--primary-2)':'rgba(255,255,255,0.72)',
          smallIcon:this.iconEl(isFolder?'folder':'film',17,1.8),
          thumb: isFolder
            ? this.iconEl('folder',34,1.6)
            : (it.url
                ? React.createElement('video',{src:it.url,preload:'metadata',muted:true,style:{width:'100%',height:'100%',objectFit:'cover',display:'block'}})
                : React.createElement('div',{style:{display:'flex',flexDirection:'column',alignItems:'center',gap:6}},
                    this.iconEl('play',22,1.8),
                    React.createElement('span',{style:{fontSize:10.5,fontWeight:700,letterSpacing:'0.06em'}},it.ext||'VIDÉO'))),
          onOpen:()=> isFolder ? this.setState({rushFolder:it.id,rushQuery:''}) : this.setState({rushPreviewId:it.id}),
          onRename:e=>{ e.stopPropagation(); this.setState({rushRenameId:it.id,rushRenameVal:it.name}); },
          onDelete:e=>{ e.stopPropagation(); this.rushDelete(it.id); },
          onDragStart:e=>{ e.dataTransfer.setData('text/tts-rush',String(it.id)); e.dataTransfer.effectAllowed='move'; },
          onDragOver:e=>{ if(isFolder){ e.preventDefault(); e.stopPropagation(); if(S.rushOverId!==it.id) this.setState({rushOverId:it.id}); } },
          onDragLeave:e=>{ if(isFolder&&S.rushOverId===it.id) this.setState({rushOverId:null}); },
          onDrop:e=>{
            if(!isFolder) return;
            e.preventDefault(); e.stopPropagation();
            const id=parseInt(e.dataTransfer.getData('text/tts-rush'),10);
            const files=Array.from((e.dataTransfer&&e.dataTransfer.files)||[]);
            if(!isNaN(id)) this.rushMove(id,it.id);
            else if(files.length){ this.setState({rushFolder:it.id,rushOverId:null},()=>this.rushAddFiles(files)); }
            else this.setState({rushOverId:null});
          }
        };
      }),
      rushRenameOpen:S.rushRenameId!=null, rushRenameVal:S.rushRenameVal,
      onRushRenameVal:e=>this.setState({rushRenameVal:e.target.value}),
      onRushRenameKey:e=>{ if(e.key==='Enter') this.rushSaveName(); if(e.key==='Escape') this.setState({rushRenameId:null}); },
      rushRenameClose:()=>this.setState({rushRenameId:null}),
      rushRenameSave:()=>this.rushSaveName(),
      rushPreviewOpen:!!rushPrev,
      rushPreviewName:rushPrev?rushPrev.name:'',
      rushPreviewMeta:rushPrev?[rushPrev.ext,this.fmtDuree(rushPrev.duration),this.fmtTaille(rushPrev.size),'importé '+this.ilYA(rushPrev.createdAt)].filter(Boolean).join(' · '):'',
      rushPreviewMedia:rushPrev
        ? (rushPrev.url
            ? React.createElement('video',{src:rushPrev.url,controls:true,autoPlay:false,style:{width:'100%',maxHeight:'62vh',display:'block',background:'#000'}})
            : React.createElement('div',{style:{display:'flex',flexDirection:'column',alignItems:'center',gap:10,color:'rgba(255,255,255,0.75)',padding:'50px 30px',textAlign:'center'}},
                this.iconEl('film',30,1.6),
                React.createElement('div',{style:{fontSize:13,fontWeight:600,maxWidth:280,lineHeight:1.5}},'Aperçu indisponible — ce rush est stocké côté TikTok Shop. Réimporte le fichier pour le lire ici.')))
        : null,
      rushPreviewClose:()=>this.setState({rushPreviewId:null}),
      rushPreviewRename:()=>this.setState({rushRenameId:rushPrev.id,rushRenameVal:rushPrev.name,rushPreviewId:null}),
      isPartenaires:S.page==='partenaires', isProspection:S.page==='prospection', isIdees:S.page==='idees',
      isCommandes:S.page==='commandes',
      isParametres:S.page==='parametres',
      isOther:['dashboard','analytics','partenaires','prospection','idees','commandes','parametres','assistant','rushs','videos'].indexOf(S.page)<0,

      isVideosPage:S.page==='videos',
      chevronMiniIcon:this.iconEl('chevron',12,2.2),
      videoBigIcon:this.iconEl('video',26,1.7),
      vidQuery:S.vidQuery,
      onVidQuery:e=>this.setState({vidQuery:e.target.value}),
      vidIsGrid:S.vidView==='grid'&&vidKids.length>0,
      vidIsList:S.vidView==='list'&&vidKids.length>0,
      vidEmpty:vidKids.length===0,
      vidEmptyTitle:(S.vidFilter!=='Tous'||S.vidQuery)?'Aucune vidéo ici':'Importe tes vidéos montées',
      vidEmptySub:(S.vidFilter!=='Tous'||S.vidQuery)?'Change de statut ou vide la recherche pour revoir toute la bibliothèque.':'Glisse tes exports finaux ici, range-les par marque et suis leur statut jusqu\u2019à la publication.',
      vidGridBtn:{onClick:()=>this.setState({vidView:'grid'}),bg:S.vidView==='grid'?'var(--card)':'transparent',fg:S.vidView==='grid'?'var(--primary-2)':'var(--text-3)'},
      vidListBtn:{onClick:()=>this.setState({vidView:'list'}),bg:S.vidView==='list'?'var(--card)':'transparent',fg:S.vidView==='list'?'var(--primary-2)':'var(--text-3)'},
      vidInFolder:!!vidFolderObj, vidFolderName:vidFolderObj?vidFolderObj.name:'',
      vidRootFg:vidFolderObj?'var(--text-3)':'var(--text)',
      vidGoRoot:()=>this.setState({vidFolder:null,vidQuery:''}),
      vidNewFolder:()=>this.vidNewFolderFn(),
      vidInputRef:this.vidRef||(this.vidRef=React.createRef()),
      vidBrowse:()=>this.vidRef.current&&this.vidRef.current.click(),
      onVidPick:e=>{ this.vidAddFiles(Array.from(e.target.files||[])); e.target.value=''; },
      onVidDragOver:e=>{ e.preventDefault(); if(!S.vidDrag) this.setState({vidDrag:true}); },
      onVidDragLeave:e=>{ e.preventDefault(); this.setState({vidDrag:false}); },
      onVidDrop:e=>{
        e.preventDefault();
        const files=Array.from((e.dataTransfer&&e.dataTransfer.files)||[]).filter(f=>f.type.indexOf('video/')===0||/\.(mp4|mov|avi|mkv|webm|m4v|mpg|mpeg|wmv|flv)$/i.test(f.name));
        this.setState({vidDrag:false});
        if(files.length) this.vidAddFiles(files);
      },
      vidDropBorder:S.vidDrag?'var(--primary)':'var(--border-2)',
      vidDropBg:S.vidDrag?'var(--primary-softer)':'transparent',
      vidFilters:['Tous'].concat(this.VID_STATUSES()).map(f=>{
        const active=S.vidFilter===f;
        const c=f==='Tous'?{bg:'var(--primary-soft)',fg:'var(--primary-2)'}:this.vidStatusColor(f);
        const count=f==='Tous'?S.vidItems.filter(i=>i.kind==='file').length:S.vidItems.filter(i=>i.status===f).length;
        return {label:f,count:count,onClick:()=>this.setState({vidFilter:f}),bg:active?c.bg:'var(--card)',fg:active?c.fg:'var(--text-2)',border:active?'transparent':'var(--border-2)'};
      }),
      vidCards:vidKids.map(it=>{
        const isFolder=it.kind==='folder';
        const over=S.vidOverId===it.id;
        const count=isFolder?S.vidItems.filter(x=>x.parent===it.id).length:0;
        const dur=this.fmtDuree(it.duration);
        const st=this.vidStatusColor(it.status);
        const statuses=this.VID_STATUSES();
        const meta=isFolder
          ? (count?count+(count>1?' vidéos':' vidéo'):'Vide')+' · '+this.ilYA(it.createdAt)
          : [dur,this.fmtTaille(it.size),this.ilYA(it.createdAt)].filter(Boolean).join(' · ');
        return {
          key:it.id, name:it.name, meta:meta, isFile:!isFolder, draggable:true,
          status:it.status, stBg:st.bg, stFg:st.fg,
          menuOpen:S.vidMenuId===it.id,
          closeMenu:()=>this.setState({vidMenuId:null}),
          onStatusClick:e=>{ e.stopPropagation(); this.setState(s=>({vidMenuId:s.vidMenuId===it.id?null:it.id})); },
          onStatusCycle:e=>{ e.stopPropagation(); const i=statuses.indexOf(it.status); this.vidSetStatus(it.id,statuses[(i+1)%statuses.length]); },
          statusOptions:statuses.map(s2=>{
            const c=this.vidStatusColor(s2);
            return {label:s2,dot:c.fg,bg:s2===it.status?'var(--primary-softer)':'transparent',onClick:e=>{ e.stopPropagation(); this.vidSetStatus(it.id,s2); }};
          }),
          border:over?'var(--primary)':'var(--border)',
          rowAccent:over?'var(--primary)':'transparent',
          thumbBg:isFolder?'var(--primary-soft)':'#0E0A1A',
          thumbFg:isFolder?'var(--primary-2)':'rgba(255,255,255,0.72)',
          smallIcon:this.iconEl(isFolder?'folder':'video',17,1.8),
          thumb: isFolder
            ? this.iconEl('folder',34,1.6)
            : (it.url
                ? React.createElement('video',{src:it.url,preload:'metadata',muted:true,style:{width:'100%',height:'100%',objectFit:'cover',display:'block'}})
                : React.createElement('div',{style:{display:'flex',flexDirection:'column',alignItems:'center',gap:6}},
                    this.iconEl('play',22,1.8),
                    React.createElement('span',{style:{fontSize:10.5,fontWeight:700,letterSpacing:'0.06em'}},it.ext||'VIDÉO'))),
          onOpen:()=> isFolder ? this.setState({vidFolder:it.id,vidQuery:''}) : this.setState({vidPreviewId:it.id}),
          onRename:e=>{ e.stopPropagation(); this.setState({vidRenameId:it.id,vidRenameVal:it.name}); },
          onDelete:e=>{ e.stopPropagation(); this.vidDelete(it.id); },
          onDragStart:e=>{ e.dataTransfer.setData('text/tts-vid',String(it.id)); e.dataTransfer.effectAllowed='move'; },
          onDragOver:e=>{ if(isFolder){ e.preventDefault(); e.stopPropagation(); if(S.vidOverId!==it.id) this.setState({vidOverId:it.id}); } },
          onDragLeave:e=>{ if(isFolder&&S.vidOverId===it.id) this.setState({vidOverId:null}); },
          onDrop:e=>{
            if(!isFolder) return;
            e.preventDefault(); e.stopPropagation();
            const id=parseInt(e.dataTransfer.getData('text/tts-vid'),10);
            const files=Array.from((e.dataTransfer&&e.dataTransfer.files)||[]);
            if(!isNaN(id)) this.vidMove(id,it.id);
            else if(files.length){ this.setState({vidFolder:it.id,vidOverId:null},()=>this.vidAddFiles(files)); }
            else this.setState({vidOverId:null});
          }
        };
      }),
      vidRenameOpen:S.vidRenameId!=null, vidRenameVal:S.vidRenameVal,
      onVidRenameVal:e=>this.setState({vidRenameVal:e.target.value}),
      onVidRenameKey:e=>{ if(e.key==='Enter') this.vidSaveName(); if(e.key==='Escape') this.setState({vidRenameId:null}); },
      vidRenameClose:()=>this.setState({vidRenameId:null}),
      vidRenameSave:()=>this.vidSaveName(),
      vidPreviewOpen:!!vidPrev,
      vidPreviewName:vidPrev?vidPrev.name:'',
      vidPreviewMeta:vidPrev?[vidPrev.ext,this.fmtDuree(vidPrev.duration),this.fmtTaille(vidPrev.size),'ajoutée '+this.ilYA(vidPrev.createdAt)].filter(Boolean).join(' · '):'',
      vidPreviewStatuses:vidPrev?this.VID_STATUSES().map(s2=>{
        const c=this.vidStatusColor(s2), on=vidPrev.status===s2;
        return {label:s2,bg:on?c.bg:'var(--card)',fg:on?c.fg:'var(--text-3)',border:on?'transparent':'var(--border-2)',onClick:()=>this.vidSetStatus(vidPrev.id,s2)};
      }):[],
      vidPreviewMedia:vidPrev
        ? (vidPrev.url
            ? React.createElement('video',{src:vidPrev.url,controls:true,style:{width:'100%',maxHeight:'62vh',display:'block',background:'#000'}})
            : React.createElement('div',{style:{display:'flex',flexDirection:'column',alignItems:'center',gap:10,color:'rgba(255,255,255,0.75)',padding:'50px 30px',textAlign:'center'}},
                this.iconEl('video',30,1.6),
                React.createElement('div',{style:{fontSize:13,fontWeight:600,maxWidth:280,lineHeight:1.5}},'Aperçu indisponible — cette vidéo est hébergée sur TikTok. Réimporte le fichier pour la lire ici.')))
        : null,
      vidPreviewClose:()=>this.setState({vidPreviewId:null}),

      chevronRIcon:this.iconEl('chevronR',15,2),
      folderPlusIcon:this.iconEl('folderPlus',16,1.8),
      uploadIcon:this.iconEl('upload',16,1.9),
      uploadBigIcon:this.iconEl('upload',26,1.7),
      gridIcon:this.iconEl('grid',15,1.8),
      listIcon:this.iconEl('list',15,1.9),
      penIcon:this.iconEl('pen',14,1.8),
      trashIcon2:this.iconEl('trash',14,1.8),

      isAssistant:S.page==='assistant',
      sparkIcon:this.iconEl('spark',24,1.7),
      sendIcon:this.iconEl('send',16,1.9),
      chatInput:S.chatInput, chatBusy:S.chatBusy, chatErr:S.chatErr,
      chatEmpty:S.chat.length===0, hasChat:S.chat.length>0,
      chatScrollRef:el=>{ this._chatEl=el; },
      onChatInput:e=>this.setState({chatInput:e.target.value}),
      onChatKey:e=>{ if(e.key==='Enter'&&!e.shiftKey){ e.preventDefault(); this.askAgent(); } },
      sendChat:()=>this.askAgent(),
      sendBg:S.chatBusy||!S.chatInput.trim()?'var(--text-3)':'var(--primary)',
      sendCursor:S.chatBusy||!S.chatInput.trim()?'default':'pointer',
      resetChat:()=>this.setState({chat:[],chatErr:null}),
      chatMsgs:S.chat.map((m,i)=>({
        key:i, who:m.role==='user'?'Toi':'Assistant',
        estAssistant:m.role!=='user', estUtilisateur:m.role==='user',
        initiales:m.role==='user'?((S.profile.name||'?').charAt(0)):'',
        segments:m.role==='user'?[]:this.segmentsReponse(m.content),
        text:m.content.replace(/\*\*/g,'').replace(/^\s*[-*]\s+/gm,'• '),
        justify:m.role==='user'?'flex-end':'flex-start',
        align:m.role==='user'?'right':'left',
        bg:m.role==='user'?'var(--primary-soft)':'var(--bg)',
        fg:'var(--text)',
        border:m.role==='user'?'var(--border-2)':'var(--border)'
      })),
      ctxChips:[
        {label:this.fmtNum(this._resume?this._resume.reduce((a,m)=>a+m.nb,0):this.allOrders().length)+' commandes'},
        {label:this.fmtNum(this.compteConnecte('produit'))+' produits'},
        {label:this.fmtNum(this.compteConnecte('vendeur'))+' marques'},
        {label:this.fmtNum(this.compteConnecte('videoUrl'))+' vidéos'},
        {label:S.customRange?(this.frDate(S.customRange.from)+' → '+this.frDate(S.customRange.to)):cur.label}
      ],
      suggestions:[
        "Quel est mon produit phare du mois ?",
        "Sur quelle marque appuyer aujourd'hui pour maximiser mes commissions ?",
        "Quelle vidéo convertit le mieux, et pourquoi ?",
        "Où est-ce que je perds de l'argent en ce moment ?"
      ].map(q=>({label:q,onClick:()=>this.askAgent(q)})),

      profileName:S.profile.name, profileHandle:S.profile.handle, profileEmail:S.profile.email, profilePhone:S.profile.phone,
      onProfileName:e=>this.setProfile('name',e.target.value),
      onProfileHandle:e=>this.setProfile('handle',e.target.value),
      onProfileEmail:e=>this.setProfile('email',e.target.value),
      onProfilePhone:e=>this.setProfile('phone',e.target.value),
      hasAvatar:!!S.avatarUrl, noAvatar:!S.avatarUrl,
      avatarImg: S.avatarUrl ? React.createElement('img',{src:S.avatarUrl,alt:'Photo de profil',style:{width:74,height:74,flex:'none',borderRadius:22,objectFit:'cover',border:'1px solid var(--border-2)'}}) : null,
      avatarInitials:S.profile.name.split(' ').map(w=>w.charAt(0)).join('').slice(0,2).toUpperCase(),
      avatarInputRef:this.avatarRef||(this.avatarRef=React.createRef()),
      onAvatarBrowse:()=>this.avatarRef.current&&this.avatarRef.current.click(),
      onAvatarPick:e=>this.pickAvatar(e),
      onAvatarRemove:()=>this.removeAvatar(),
      saveProfile:()=>this.enregistrerProfil(),
      profileSaved:S.profileSaved,

      pwdCurrent:S.pwd.current, pwdNext:S.pwd.next, pwdConfirm:S.pwd.confirm,
      onPwdCurrent:e=>this.setPwd('current',e.target.value),
      onPwdNext:e=>this.setPwd('next',e.target.value),
      onPwdConfirm:e=>this.setPwd('confirm',e.target.value),
      submitPwd:()=>this.submitPwd(),
      pwdMsg:S.pwdMsg, pwdMsgColor:S.pwdMsgOk?'var(--secondary)':'var(--neg)',
      pwdBarWidth:(this.pwdScore(S.pwd.next)/4*100)+'%',
      pwdBarColor:['var(--neg)','var(--neg)','var(--amber)','var(--secondary)','var(--secondary)'][this.pwdScore(S.pwd.next)],
      pwdLevel:['Trop court','Faible','Moyen','Solide','Excellent'][this.pwdScore(S.pwd.next)],
      showPwdMeter:S.pwd.next.length>0,

      notifRows:[
        ['daily','Résumé quotidien','Un récap de tes ventes chaque matin à 9h'],
        ['newOrder','Nouvelle commande','Notification à chaque vente affiliée'],
        ['brandMail','Réponse d\u2019une marque','Quand un partenaire répond à ta prospection'],
        ['payout','Virement de commissions','Quand TikTok Shop déclenche un paiement']
      ].map(r=>({ label:r[1], sub:r[2], on:S.notifs[r[0]],
        knobLeft:S.notifs[r[0]]?'22px':'3px', trackBg:S.notifs[r[0]]?'var(--primary)':'var(--border-2)',
        onClick:()=>this.toggleNotif(r[0]) })),
      commandesRows, cmdSort, ordersKpis, vendeurOptions, statutOptions, pagination,
      importCommandes:{
        onClick:()=>this.ouvrirImport(),
        label:S.importEnCours?'Import en cours…':'Importer',
        op:S.importEnCours?'0.6':'1', pe:S.importEnCours?'none':'auto',
        ref:this.importInputRef, onFichier:e=>this.onFichierImport(e),
        texte:S.importErr||S.importMsg||'',
        visible:!!(S.importErr||S.importMsg),
        bg:S.importErr?'var(--neg-soft)':'var(--primary-softer)',
        fg:S.importErr?'var(--neg)':'var(--text-2)'
      },
      // Largeurs inegales : des barres toutes identiques ressemblent a un tableau
      // vide plutot qu'a un contenu en cours d'arrivee.
      squelettes:[96,78,88,70,92,82,74,86].map((l,i)=>({key:i,largeur:l+'%'})),
      chargementCommandes:S.ordLoading,
      messageVide:S.ordErr||'Aucune commande ne correspond à ces filtres.',
      noCommandes:commandesRows.length===0 && !S.ordLoading,
      fVendeur:F.vendeur, fStatut:F.statut, fFrom:F.from, fTo:F.to,
      filtersActive:F.vendeur!=='Tous les vendeurs'||F.statut!=='Tous les statuts'||!!F.from||!!F.to,
      setFVendeur:e=>this.setOrdFilter('vendeur',e.target.value),
      setFStatut:e=>this.setOrdFilter('statut',e.target.value),
      dpOpen:S.dpOpen,
      toggleDp:()=>this.setState(s=>({dpOpen:!s.dpOpen, dpMonth:s.dpOpen?s.dpMonth:(s.ordFilters.from?s.ordFilters.from.slice(0,7):s.dpMonth), dpStart:s.dpOpen?s.dpStart:(s.ordFilters.from||null), dpEnd:s.dpOpen?s.dpEnd:(s.ordFilters.to||null)})),
      closeDp:()=>this.setState({dpOpen:false}),
      dpLabel: F.from ? (this.frDate(F.from)+(F.to&&F.to!==F.from?'  →  '+this.frDate(F.to):'')) : 'Toutes les dates',
      dpMonthLabel:this.monthLabel(S.dpMonth),
      dpCells:this.buildCalendar(),
      dpPrev:()=>this.shiftMonth(-1), dpNext:()=>this.shiftMonth(1),
      dpShortcuts:this.rangeShortcuts().map(s=>({ label:s[0], onClick:()=>this.setRange(s[1],s[2]) })),
      dpApply:()=>this.applyRange(), dpDisabled:!S.dpStart,
      dpApplyOpacity:S.dpStart?1:0.45,
      dpSelLabel: S.dpStart ? (this.frDate(S.dpStart)+(S.dpEnd?'  →  '+this.frDate(S.dpEnd):'  →  …')) : 'Choisis une date de début',
      stopProp:e=>e.stopPropagation(),
      resetFilters:()=>this.setState({ordPage:1,ordFilters:{vendeur:'Tous les vendeurs',statut:'Tous les statuts',from:'',to:''}}),
      showPeriod:S.page==='dashboard'||S.page==='analytics',
      navGroups, assistantItem, deconnexionItem, periodOptions,
      periodLabel: S.customRange ? (this.frDate(S.customRange.from)+'  →  '+this.frDate(S.customRange.to)) : cur.label,
      periodOpen:S.periodOpen,
      togglePeriod:()=>this.setState(s=>({periodOpen:!s.periodOpen, dpStart:s.periodOpen?s.dpStart:(s.customRange?s.customRange.from:null), dpEnd:s.periodOpen?s.dpEnd:(s.customRange?s.customRange.to:null)})),
      closePeriod:()=>this.setState({periodOpen:false}),
      applyPeriodRange:()=>{ const st=this.state; this.setState({periodOpen:false, customRange:{from:st.dpStart, to:st.dpEnd||st.dpStart}}); },
      calendarIcon:this.iconEl('calendar',16,1.9), chevronIcon:this.iconEl('chevron',15,2), checkIcon:this.iconEl('check',15,2.2),
      chevronRightIcon:this.iconEl('chevronR',16,2), alertIcon:this.iconEl('alert',20,1.9), tiktokIcon:this.iconEl('tiktok',22,1.9),
      otherIcon:this.iconEl(((this.PAGES[S.page]&&{commandes:'bag',videos:'video',idees:'bulb',produits:'box',parametres:'settings'}[S.page])||'box'),30,1.7),
      dashKpis, lineChart:this.renderLineChart(cur), topProduits, topToggle, fileDeTravail, fileCount:this.FILE.length,
      aPoster, aPosterCount:aPoster.length+(aPoster.length>1?' vidéos prêtes':' vidéo prête'), aPosterVide:aPoster.length===0,
      ideesMarquees, ideesMarqueesVide:ideesMarquees.length===0,
      etoileIcon:this.iconEl('star',15,2,'currentColor'), chantierIcon:this.iconEl('chantier',20,1.8), videoIcon:this.iconEl('video',15,1.9),
      analyticsTabs, isCompte:S.tab==='compte', isMarques:S.tab==='marques', isProduits:S.tab==='produits', isVideos:S.tab==='videos',
      compteKpis, isEligLow:cur.ineligibles>0, eligPct:this.fmtPct(elig,1), eligCount:cur.ineligibles, donut:this.renderDonut(cur),
      marquesRows, marquesSort, produitsRows, produitsSort, videosRows, videosSort,
      tiktokConnected:tiktok, tiktokOff:!tiktok,

      partenairesRows, partenairesSort,
      partnerDetail:!!selBrand, partnerList:!selBrand,
      partnerName:S.selectedPartner||'', partnerInitial:(S.selectedPartner||'').charAt(0),
      partnerProductCount:selBrand?this.PRODUCTS.filter(p=>p.boutique===selBrand.name).length:0,
      partnerKpis, partnerProductsRows, partnerProductsSort,
      backToPartners:()=>this.backToPartners(),
      chevronLIcon:this.iconEl('chevronL',15,2.2),

      prospectCount:S.prospects.length, prospectRows,
      openProspectForm:()=>this.openProspectForm(), closeProspectForm:()=>this.closeProspectForm(), submitProspect:()=>this.submitProspect(),
      prospectFormOpen:S.prospectFormOpen, prospectForm, stopProp:e=>e.stopPropagation(),
      plusIcon:this.iconEl('plus',16,2.2), plusSmIcon:this.iconEl('plus',13,2.4),
      trashIcon:this.iconEl('trash',16,1.8), trashSmIcon:this.iconEl('trash',14,1.8),
      threadOpen:!!selProspect, closeThread:()=>this.closeThread(),
      threadName:selProspect?selProspect.name:'', threadInitial:selProspect?selProspect.name.charAt(0):'',
      threadContact:selProspect?selProspect.contact:'',
      threadMessages, threadEmpty:rawThread.length===0,
      threadReply:{
        subject:S.threadReply.subject, body:S.threadReply.body,
        onSubject:e=>this.setState(s=>({threadReply:Object.assign({},s.threadReply,{subject:e.target.value})})),
        onBody:e=>this.setState(s=>({threadReply:Object.assign({},s.threadReply,{body:e.target.value})})),
        onSend:()=>this.sendThreadReply(),
        disabled:!(S.threadReply.body&&S.threadReply.body.trim()),
        opacity:(S.threadReply.body&&S.threadReply.body.trim())?1:0.5
      },
      mailIcon:this.iconEl('mail',20,1.8), mailSmIcon:this.iconEl('mail',13,2),

      ideaCount:S.ideas.length, ideaCards, noIdeas:S.ideas.length===0,
      isPinterestView:S.view!=='list', isListView:S.view==='list', viewToggle,
      composerText:S.composerText, onComposerChange:e=>this.setState({composerText:e.target.value}),
      composerBorder:S.dragOver?'var(--primary)':'var(--border-2)',
      aiProcessing:S.aiProcessing,
      onDragOver:e=>this.onDragOver(e), onDragLeave:()=>this.onDragLeave(), onDrop:e=>this.onDrop(e),
      fileInputRef:this.fileInputRef, onFilePicked:e=>this.onFilePicked(e), onBrowseClick:()=>this.onBrowseClick(),
      isRecording:S.isRecording, speechSupported, toggleDictation:()=>this.toggleDictation(), micError:S.micError,
      micBorder:S.isRecording?'var(--neg)':'var(--border-2)', micBg:S.isRecording?'var(--neg-soft)':'var(--card)', micFg:S.isRecording?'var(--neg)':'var(--text-2)',
      micLabel:S.isRecording?'Arrêter':'Dicter', micIcon:this.iconEl('mic',15,2),
      addIdea:()=>this.addIdea(), clipIcon:this.iconEl('video',15,2), linkIcon:this.iconEl('link',16,1.9), pinIcon:this.iconEl('star',13,2),
      bulbIcon:this.iconEl('bulb',26,1.7)
    };
  }
}
