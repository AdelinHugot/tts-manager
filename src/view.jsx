// ⚠️  FICHIER GÉNÉRÉ — ne pas éditer à la main.
// Source : design/TTS Manager.dc.html  ·  Générateur : tools/dc-to-jsx.mjs
// Régénérer avec : npm run gen:view
import React from 'react';
import { css, sp } from './lib/style.js';

const st0 = {"display":"flex","height":"100vh","background":"var(--bg)","color":"var(--text)","fontFamily":"'Inter',system-ui,sans-serif"};
const st1 = {"width":"248px","flex":"none","background":"var(--sidebar)","borderRight":"1px solid var(--border)","display":"flex","flexDirection":"column","padding":"22px 16px","height":"100vh"};
const st2 = {"display":"flex","alignItems":"center","gap":"11px","padding":"4px 8px 22px"};
const st3 = {"width":"36px","height":"36px","borderRadius":"11px","background":"linear-gradient(135deg,var(--primary),var(--primary-2))","display":"flex","alignItems":"center","justifyContent":"center","color":"#fff","fontWeight":"800","fontSize":"16px","boxShadow":"0 4px 12px rgba(124,111,247,0.32)"};
const st4 = {"fontWeight":"700","fontSize":"15px","letterSpacing":"-0.02em"};
const st5 = {"fontSize":"11px","color":"var(--text-3)","fontWeight":"500","marginTop":"1px"};
const st6 = {"display":"flex","flexDirection":"column","gap":"18px"};
const st7 = {"display":"flex","flexDirection":"column","gap":"2px"};
const st8 = {"fontSize":"10.5px","fontWeight":"700","textTransform":"uppercase","letterSpacing":"0.08em","color":"var(--text-3)","padding":"0 12px 6px"};
const st9 = {"display":"flex","width":"20px","height":"20px","alignItems":"center","justifyContent":"center","flex":"none"};
const st10 = {"flex":"1"};
const st11 = {"fontSize":"10.5px","fontWeight":"700","background":"var(--primary)","color":"#fff","padding":"1px 7px","borderRadius":"999px"};
const st12 = {"display":"flex","alignItems":"center","gap":"10px","padding":"9px","borderRadius":"13px","background":"var(--primary-softer)","border":"1px solid var(--border)"};
const st13 = {"width":"34px","height":"34px","flex":"none","borderRadius":"50%","background":"linear-gradient(135deg,var(--primary),var(--secondary))","color":"#fff","display":"flex","alignItems":"center","justifyContent":"center","fontWeight":"700","fontSize":"12.5px"};
const st14 = {"flex":"1","minWidth":"0"};
const st15 = {"fontSize":"13px","fontWeight":"600","whiteSpace":"nowrap","overflow":"hidden","textOverflow":"ellipsis"};
const st16 = {"fontSize":"11px","color":"var(--text-3)"};
const st17 = {"flex":"1","minWidth":"0","display":"flex","flexDirection":"column","height":"100vh","overflowY":"auto"};
const st18 = {"position":"sticky","top":"0","zIndex":"20","background":"rgba(246,244,253,0.82)","backdropFilter":"blur(12px)","WebkitBackdropFilter":"blur(12px)","borderBottom":"1px solid var(--border)","padding":"18px 32px","display":"flex","alignItems":"center","justifyContent":"space-between","gap":"16px"};
const st19 = {"fontSize":"21px","fontWeight":"700","letterSpacing":"-0.02em"};
const st20 = {"fontSize":"13px","color":"var(--text-3)","marginTop":"2px"};
const st21 = {"position":"relative"};
const st22 = {"display":"flex","alignItems":"center","gap":"9px","padding":"9px 14px","border":"1px solid var(--border-2)","background":"var(--card)","borderRadius":"12px","cursor":"pointer","fontSize":"13.5px","fontWeight":"600","color":"var(--text)","boxShadow":"0 1px 2px rgba(30,20,60,0.04)"};
const st23 = {"color":"var(--primary)","display":"flex"};
const st24 = {"color":"var(--text-3)","display":"flex"};
const st25 = {"position":"fixed","inset":"0","zIndex":"30"};
const st26 = {"position":"absolute","right":"0","top":"50px","zIndex":"31","display":"flex","background":"var(--card)","border":"1px solid var(--border)","borderRadius":"20px","boxShadow":"0 20px 50px rgba(40,28,90,0.18)","overflow":"hidden","animation":"fadeIn .14s ease"};
const st27 = {"width":"190px","flex":"none","background":"var(--primary-softer)","borderRight":"1px solid var(--border)","padding":"16px 12px","display":"flex","flexDirection":"column","gap":"2px"};
const st28 = {"fontSize":"10.5px","fontWeight":"700","textTransform":"uppercase","letterSpacing":"0.09em","color":"var(--text-3)","padding":"2px 8px 10px"};
const st29 = {"padding":"16px 18px 14px","width":"330px"};
const st30 = {"display":"flex","alignItems":"center","justifyContent":"space-between","marginBottom":"12px"};
const st31 = {"width":"28px","height":"28px","border":"1px solid var(--border-2)","background":"var(--card)","borderRadius":"9px","cursor":"pointer","color":"var(--text-2)","display":"flex","alignItems":"center","justifyContent":"center","fontSize":"15px","lineHeight":"1","fontFamily":"inherit"};
const st32 = {"fontSize":"13.5px","fontWeight":"700","letterSpacing":"0.03em","textTransform":"uppercase"};
const st33 = {"display":"grid","gridTemplateColumns":"repeat(7,1fr)","marginBottom":"4px"};
const st34 = {"textAlign":"center","fontSize":"10.5px","fontWeight":"700","color":"var(--text-3)","letterSpacing":"0.05em","padding":"4px 0"};
const st35 = {"display":"grid","gridTemplateColumns":"repeat(7,1fr)"};
const st36 = {"display":"flex","alignItems":"center","justifyContent":"space-between","gap":"12px","borderTop":"1px solid var(--border)","marginTop":"12px","paddingTop":"12px"};
const st37 = {"fontSize":"12px","fontWeight":"600","color":"var(--text-3)"};
const st38 = {"display":"flex","alignItems":"center","gap":"8px","flexWrap":"wrap","justifyContent":"flex-end"};
const st39 = {"appearance":"none","padding":"9px 14px","border":"1px solid var(--border-2)","background":"var(--card)","borderRadius":"12px","cursor":"pointer","fontSize":"13.5px","fontWeight":"600","fontFamily":"inherit","color":"var(--text)","boxShadow":"0 1px 2px rgba(30,20,60,0.04)","maxWidth":"180px"};
const st40 = {"appearance":"none","padding":"9px 14px","border":"1px solid var(--border-2)","background":"var(--card)","borderRadius":"12px","cursor":"pointer","fontSize":"13.5px","fontWeight":"600","fontFamily":"inherit","color":"var(--text)","boxShadow":"0 1px 2px rgba(30,20,60,0.04)"};
const st41 = {"display":"flex","alignItems":"center","gap":"9px","padding":"9px 14px","border":"1px solid var(--border-2)","background":"var(--card)","borderRadius":"12px","cursor":"pointer","fontSize":"13.5px","fontWeight":"600","color":"var(--text)","boxShadow":"0 1px 2px rgba(30,20,60,0.04)","fontFamily":"inherit"};
const st42 = {"textAlign":"left","padding":"8px 10px","border":"none","background":"transparent","borderRadius":"9px","cursor":"pointer","fontSize":"13px","fontWeight":"600","color":"var(--text-2)","fontFamily":"inherit"};
const st43 = {"padding":"9px 14px","border":"1px solid var(--border-2)","borderRadius":"12px","background":"#F4F3F7","color":"var(--text-2)","fontSize":"13px","fontWeight":"600","fontFamily":"inherit","cursor":"pointer"};
const st44 = {"display":"flex","flexDirection":"column","gap":"18px","padding":"26px 32px 56px"};
const st45 = {"display":"flex","alignItems":"center","gap":"13px","background":"var(--primary-softer)","border":"1px solid var(--border-2)","borderRadius":"16px","padding":"14px 16px"};
const st46 = {"color":"var(--primary)","display":"flex","flex":"none"};
const st47 = {"fontSize":"13.5px","color":"var(--text-2)","fontWeight":"500"};
const st48 = {"display":"grid","gridTemplateColumns":"repeat(4,1fr)","gap":"16px"};
const st49 = {"background":"var(--card)","border":"1px solid var(--border)","borderRadius":"18px","padding":"18px","boxShadow":"0 1px 8px rgba(30,20,60,0.04)"};
const st50 = {"display":"flex","alignItems":"flex-start","justifyContent":"space-between"};
const st51 = {"fontSize":"13px","color":"var(--text-2)","fontWeight":"500","marginTop":"15px"};
const st52 = {"fontSize":"28px","fontWeight":"700","letterSpacing":"-0.03em","marginTop":"3px","fontVariantNumeric":"tabular-nums"};
const st53 = {"fontSize":"12px","color":"var(--text-3)","marginTop":"7px"};
const st54 = {"display":"grid","gridTemplateColumns":"1.75fr 1fr","gap":"16px"};
const st55 = {"background":"var(--card)","border":"1px solid var(--border)","borderRadius":"18px","padding":"20px 20px 14px","boxShadow":"0 1px 8px rgba(30,20,60,0.04)","display":"flex","flexDirection":"column"};
const st56 = {"display":"flex","alignItems":"center","justifyContent":"space-between","marginBottom":"6px"};
const st57 = {"fontSize":"15px","fontWeight":"700","letterSpacing":"-0.01em"};
const st58 = {"display":"flex","gap":"16px"};
const st59 = {"display":"flex","alignItems":"center","gap":"6px","fontSize":"12px","fontWeight":"600","color":"var(--text-2)"};
const st60 = {"width":"9px","height":"9px","borderRadius":"3px","background":"var(--primary)"};
const st61 = {"width":"9px","height":"9px","borderRadius":"3px","background":"var(--secondary)"};
const st62 = {"background":"var(--card)","border":"1px solid var(--border)","borderRadius":"18px","padding":"20px","boxShadow":"0 1px 8px rgba(30,20,60,0.04)"};
const st63 = {"display":"flex","background":"var(--primary-softer)","borderRadius":"10px","padding":"3px"};
const st64 = {"display":"flex","alignItems":"center","gap":"12px","padding":"11px 0","borderTop":"1px solid var(--border)"};
const st65 = {"fontSize":"13.5px","fontWeight":"600","whiteSpace":"nowrap","overflow":"hidden","textOverflow":"ellipsis"};
const st66 = {"fontSize":"12px","color":"var(--text-3)","marginTop":"1px"};
const st67 = {"fontSize":"13.5px","fontWeight":"700","fontVariantNumeric":"tabular-nums"};
const st68 = {"display":"flex","alignItems":"center","justifyContent":"space-between","marginBottom":"4px"};
const st69 = {"fontSize":"12.5px","color":"var(--text-3)","fontWeight":"500"};
const st70 = {"display":"grid","gridTemplateColumns":"128px 1fr auto","alignItems":"center","gap":"16px","padding":"13px 0","borderTop":"1px solid var(--border)"};
const st71 = {"minWidth":"0"};
const st72 = {"display":"flex","flexDirection":"column","gap":"20px","padding":"26px 32px 56px"};
const st73 = {"display":"flex","gap":"2px","borderBottom":"1px solid var(--border)"};
const st74 = {"display":"grid","gridTemplateColumns":"repeat(3,1fr)","gap":"16px"};
const st75 = {"fontSize":"13px","color":"var(--text-2)","fontWeight":"500","marginTop":"14px"};
const st76 = {"fontSize":"26px","fontWeight":"700","letterSpacing":"-0.03em","marginTop":"3px","fontVariantNumeric":"tabular-nums"};
const st77 = {"display":"flex","alignItems":"center","gap":"13px","background":"var(--amber-soft)","border":"1px solid #EAD49E","borderRadius":"14px","padding":"14px 16px"};
const st78 = {"color":"var(--amber)","display":"flex","flex":"none"};
const st79 = {"fontSize":"13.5px","color":"#7A5A14","fontWeight":"500"};
const st80 = {"fontWeight":"700"};
const st81 = {"display":"grid","gridTemplateColumns":"1.75fr 1fr","gap":"16px","alignItems":"start"};
const st82 = {"display":"flex","alignItems":"center","justifyContent":"space-between","marginBottom":"6px","gap":"12px"};
const st83 = {"fontSize":"15px","fontWeight":"700","letterSpacing":"-0.01em","marginBottom":"8px"};
const st84 = {"background":"var(--card)","border":"1px solid var(--border)","borderRadius":"18px","overflowX":"auto","boxShadow":"0 1px 8px rgba(30,20,60,0.04)"};
const st85 = {"width":"100%","minWidth":"760px","borderCollapse":"collapse","fontSize":"13.5px"};
const st86 = {"borderBottom":"1px solid var(--border)"};
const st87 = {"textAlign":"left","padding":"14px 18px","fontSize":"11px","fontWeight":"700","textTransform":"uppercase","letterSpacing":"0.05em","cursor":"pointer","userSelect":"none"};
const st88 = {"textAlign":"right","padding":"14px 18px","fontSize":"11px","fontWeight":"700","textTransform":"uppercase","letterSpacing":"0.05em","cursor":"pointer","userSelect":"none"};
const st89 = {"padding":"13px 18px","fontWeight":"600"};
const st90 = {"padding":"13px 18px","textAlign":"right","color":"var(--text-2)","fontVariantNumeric":"tabular-nums"};
const st91 = {"padding":"13px 18px","textAlign":"right","fontWeight":"600","fontVariantNumeric":"tabular-nums"};
const st92 = {"padding":"13px 18px","textAlign":"right","fontWeight":"700","color":"var(--secondary)","fontVariantNumeric":"tabular-nums"};
const st93 = {"padding":"13px 18px","textAlign":"right"};
const st94 = {"padding":"13px 18px","color":"var(--text-2)"};
const st95 = {"position":"fixed","inset":"0","zIndex":"40","background":"rgba(30,20,60,0.28)","display":"flex","alignItems":"center","justifyContent":"center"};
const st96 = {"width":"420px","maxWidth":"92vw","background":"var(--card)","borderRadius":"20px","boxShadow":"0 24px 60px rgba(30,20,60,0.24)","padding":"24px","display":"flex","flexDirection":"column","gap":"14px","animation":"fadeIn .16s ease"};
const st97 = {"fontSize":"16px","fontWeight":"700"};
const st98 = {"display":"flex","flexDirection":"column","gap":"5px"};
const st99 = {"fontSize":"12px","fontWeight":"600","color":"var(--text-2)"};
const st100 = {"padding":"10px 12px","border":"1px solid var(--border-2)","borderRadius":"10px","fontSize":"13.5px"};
const st101 = {"display":"flex","gap":"10px","marginTop":"6px"};
const st102 = {"flex":"1","padding":"10px","border":"1px solid var(--border-2)","background":"var(--card)","borderRadius":"11px","fontSize":"13.5px","fontWeight":"600","cursor":"pointer","color":"var(--text-2)"};
const st103 = {"flex":"1","padding":"10px","border":"none","background":"var(--primary)","color":"#fff","borderRadius":"11px","fontSize":"13.5px","fontWeight":"600","cursor":"pointer"};
const st104 = {"position":"fixed","inset":"0","zIndex":"40","background":"rgba(30,20,60,0.32)","display":"flex","alignItems":"center","justifyContent":"center"};
const st105 = {"width":"560px","maxWidth":"92vw","maxHeight":"82vh","background":"var(--card)","borderRadius":"20px","boxShadow":"0 24px 60px rgba(30,20,60,0.24)","display":"flex","flexDirection":"column","animation":"fadeIn .16s ease","overflow":"hidden"};
const st106 = {"display":"flex","alignItems":"center","gap":"12px","padding":"18px 20px","borderBottom":"1px solid var(--border)","flex":"none"};
const st107 = {"width":"38px","height":"38px","flex":"none","borderRadius":"11px","background":"linear-gradient(135deg,var(--primary),var(--secondary))","color":"#fff","fontWeight":"700","fontSize":"14px","display":"flex","alignItems":"center","justifyContent":"center"};
const st108 = {"fontSize":"15px","fontWeight":"700"};
const st109 = {"width":"28px","height":"28px","flex":"none","border":"none","borderRadius":"9px","background":"var(--primary-softer)","color":"var(--text-2)","cursor":"pointer","fontSize":"15px","lineHeight":"1","display":"flex","alignItems":"center","justifyContent":"center"};
const st110 = {"flex":"1","minHeight":"0","overflowY":"auto","padding":"20px","display":"flex","flexDirection":"column","gap":"14px","background":"var(--bg)"};
const st111 = {"display":"flex","alignItems":"baseline","gap":"8px","marginBottom":"5px"};
const st112 = {"fontSize":"11.5px","fontWeight":"700","opacity":"0.85"};
const st113 = {"fontSize":"10.5px","opacity":"0.65"};
const st114 = {"fontSize":"13px","fontWeight":"700","marginBottom":"4px"};
const st115 = {"fontSize":"13px","lineHeight":"1.55","whiteSpace":"pre-wrap"};
const st116 = {"display":"flex","flexDirection":"column","alignItems":"center","justifyContent":"center","padding":"40px 10px","textAlign":"center"};
const st117 = {"width":"44px","height":"44px","borderRadius":"13px","background":"var(--primary-soft)","color":"var(--primary-2)","display":"flex","alignItems":"center","justifyContent":"center"};
const st118 = {"fontSize":"13.5px","color":"var(--text-3)","marginTop":"12px"};
const st119 = {"flex":"none","borderTop":"1px solid var(--border)","padding":"14px 18px","display":"flex","flexDirection":"column","gap":"8px"};
const st120 = {"width":"100%","padding":"8px 10px","border":"1px solid var(--border-2)","borderRadius":"9px","fontSize":"13px","fontWeight":"600","color":"var(--text)"};
const st121 = {"display":"flex","gap":"8px","alignItems":"flex-end"};
const st122 = {"flex":"1","minHeight":"44px","maxHeight":"120px","padding":"8px 10px","border":"1px solid var(--border-2)","borderRadius":"9px","fontSize":"13px","color":"var(--text)","resize":"vertical","fontFamily":"inherit","lineHeight":"1.5"};
const st123 = {"display":"flex","flexDirection":"column","gap":"20px","paddingTop":"0px","paddingBottom":"0px","paddingLeft":"30px","paddingRight":"30px"};
const st124 = {"width":"100%","minHeight":"64px","border":"none","outline":"none","resize":"vertical","fontSize":"15px","fontFamily":"inherit","color":"var(--text)","background":"transparent"};
const st125 = {"display":"flex","alignItems":"center","gap":"7px","fontSize":"12.5px","color":"var(--primary-2)","fontWeight":"600","marginTop":"2px"};
const st126 = {"width":"7px","height":"7px","borderRadius":"50%","background":"var(--primary)","display":"inline-block","animation":"pulse 1s infinite"};
const st127 = {"display":"flex","alignItems":"center","justifyContent":"space-between","marginTop":"10px","gap":"10px","flexWrap":"wrap"};
const st128 = {"display":"flex","alignItems":"center","gap":"10px"};
const st129 = {"display":"none"};
const st130 = {"display":"flex","alignItems":"center","gap":"6px","padding":"8px 12px","border":"1px solid var(--border-2)","background":"var(--card)","borderRadius":"10px","fontSize":"12.5px","fontWeight":"600","cursor":"pointer","color":"var(--text-2)"};
const st131 = {"fontSize":"12px","color":"var(--neg)","fontWeight":"600","display":"flex","alignItems":"center","gap":"6px"};
const st132 = {"width":"7px","height":"7px","borderRadius":"50%","background":"var(--neg)","display":"inline-block","animation":"pulse 1s infinite"};
const st133 = {"fontSize":"12px","color":"var(--neg)","fontWeight":"600"};
const st134 = {"display":"flex","gap":"8px"};
const st135 = {"display":"flex","alignItems":"center","gap":"6px","padding":"9px 15px","border":"none","background":"var(--primary)","color":"#fff","borderRadius":"11px","fontSize":"13px","fontWeight":"600","cursor":"pointer"};
const st136 = {"display":"flex","alignItems":"center","justifyContent":"space-between"};
const st137 = {"fontSize":"13px","color":"var(--text-3)","fontWeight":"600"};
const st138 = {"columns":"4 240px","columnGap":"16px"};
const st139 = {"display":"flex","alignItems":"center","gap":"6px","position":"absolute","top":"10px","right":"10px"};
const st140 = {"width":"24px","height":"24px","border":"none","borderRadius":"50%","background":"rgba(255,255,255,0.7)","color":"var(--text-2)","cursor":"pointer","display":"flex","alignItems":"center","justifyContent":"center","fontSize":"14px","lineHeight":"1"};
const st141 = {"fontSize":"14px","color":"var(--text)","lineHeight":"1.55","whiteSpace":"pre-wrap","paddingRight":"56px"};
const st142 = {"textDecoration":"none","display":"flex","flexDirection":"column","gap":"8px","paddingRight":"56px"};
const st143 = {"width":"32px","height":"32px","borderRadius":"9px","background":"rgba(255,255,255,0.65)","display":"flex","alignItems":"center","justifyContent":"center","color":"var(--text-2)"};
const st144 = {"fontSize":"13.5px","fontWeight":"700","color":"var(--text)","wordBreak":"break-word"};
const st145 = {"fontSize":"12px","color":"var(--text-2)","wordBreak":"break-all"};
const st146 = {"display":"flex","flexDirection":"column","gap":"8px"};
const st147 = {"width":"100%","borderRadius":"11px","background":"#000","display":"block","maxHeight":"220px"};
const st148 = {"fontSize":"12.5px","fontWeight":"600","color":"var(--text-2)","wordBreak":"break-word"};
const st149 = {"fontSize":"11px","color":"var(--text-3)","marginTop":"10px","fontWeight":"500"};
const st150 = {"display":"flex","flexDirection":"column","gap":"12px"};
const st151 = {"fontSize":"14px","color":"var(--text)","lineHeight":"1.55","whiteSpace":"pre-wrap","paddingRight":"56px","maxWidth":"640px"};
const st152 = {"textDecoration":"none","display":"flex","alignItems":"center","gap":"12px","paddingRight":"56px"};
const st153 = {"width":"32px","height":"32px","flex":"none","borderRadius":"9px","background":"rgba(255,255,255,0.65)","display":"flex","alignItems":"center","justifyContent":"center","color":"var(--text-2)"};
const st154 = {"fontSize":"13.5px","fontWeight":"700","color":"var(--text)"};
const st155 = {"display":"flex","alignItems":"center","gap":"14px"};
const st156 = {"width":"180px","flex":"none","borderRadius":"11px","background":"#000","display":"block"};
const st157 = {"fontSize":"13px","fontWeight":"600","color":"var(--text-2)","wordBreak":"break-word"};
const st158 = {"display":"flex","flexDirection":"column","alignItems":"center","justifyContent":"center","padding":"70px 20px","textAlign":"center"};
const st159 = {"width":"56px","height":"56px","borderRadius":"16px","background":"var(--primary-soft)","color":"var(--primary-2)","display":"flex","alignItems":"center","justifyContent":"center"};
const st160 = {"fontSize":"14px","color":"var(--text-3)","marginTop":"14px","maxWidth":"340px","lineHeight":"1.5"};
const st161 = {"fontSize":"11.5px","fontWeight":"700","textTransform":"uppercase","letterSpacing":"0.05em","color":"var(--text-3)"};
const st162 = {"fontSize":"23px","fontWeight":"800","letterSpacing":"-0.02em","marginTop":"7px"};
const st163 = {"padding":"13px 18px","color":"var(--text-2)","whiteSpace":"nowrap"};
const st164 = {"padding":"13px 18px"};
const st165 = {"padding":"44px 20px","textAlign":"center","fontSize":"14px","color":"var(--text-3)"};
const st166 = {"display":"grid","gridTemplateColumns":"repeat(auto-fit,minmax(320px,1fr))","alignItems":"start","gap":"16px","padding":"22px 32px 28px","maxWidth":"1180px"};
const st167 = {"background":"var(--card)","border":"1px solid var(--border)","borderRadius":"18px","padding":"20px","boxShadow":"0 1px 8px rgba(30,20,60,0.04)","display":"flex","flexDirection":"column","gap":"16px","minWidth":"0"};
const st168 = {"display":"flex","alignItems":"center","gap":"18px"};
const st169 = {"width":"74px","height":"74px","flex":"none","borderRadius":"22px","background":"linear-gradient(135deg,var(--primary),var(--secondary))","color":"#fff","fontSize":"23px","fontWeight":"700","letterSpacing":"-0.02em","display":"flex","alignItems":"center","justifyContent":"center"};
const st170 = {"display":"flex","flexDirection":"column","gap":"9px"};
const st171 = {"fontSize":"13px","color":"var(--text-2)","fontWeight":"500","lineHeight":"1.5"};
const st172 = {"padding":"9px 15px","border":"none","borderRadius":"11px","background":"var(--primary)","color":"#fff","fontSize":"13px","fontWeight":"600","fontFamily":"inherit","cursor":"pointer"};
const st173 = {"padding":"9px 15px","border":"1px solid var(--border-2)","borderRadius":"11px","background":"var(--card)","color":"var(--text-2)","fontSize":"13px","fontWeight":"600","fontFamily":"inherit","cursor":"pointer"};
const st174 = {"display":"grid","gridTemplateColumns":"1fr 1fr","gap":"12px"};
const st175 = {"display":"flex","flexDirection":"column","gap":"6px","minWidth":"0"};
const st176 = {"fontSize":"11px","fontWeight":"700","textTransform":"uppercase","letterSpacing":"0.05em","color":"var(--text-3)"};
const st177 = {"width":"100%","minWidth":"0","padding":"10px 12px","border":"1px solid var(--border-2)","borderRadius":"11px","background":"var(--card)","color":"var(--text)","fontSize":"13.5px","fontWeight":"500","fontFamily":"inherit"};
const st178 = {"display":"flex","alignItems":"center","gap":"12px"};
const st179 = {"padding":"10px 18px","border":"none","borderRadius":"11px","background":"var(--primary)","color":"#fff","fontSize":"13px","fontWeight":"600","fontFamily":"inherit","cursor":"pointer"};
const st180 = {"fontSize":"13px","fontWeight":"600","color":"var(--secondary)"};
const st181 = {"background":"var(--card)","border":"1px solid var(--border)","borderRadius":"18px","padding":"20px","boxShadow":"0 1px 8px rgba(30,20,60,0.04)","display":"flex","flexDirection":"column","gap":"14px","minWidth":"0"};
const st182 = {"fontSize":"13px","color":"var(--text-3)","marginTop":"3px"};
const st183 = {"display":"flex","flexDirection":"column","gap":"6px","gridColumn":"span 2","minWidth":"0"};
const st184 = {"width":"100%","minWidth":"0","padding":"10px 12px","border":"1px solid var(--border-2)","borderRadius":"11px","background":"var(--card)","color":"var(--text)","fontSize":"13.5px","fontFamily":"inherit"};
const st185 = {"display":"flex","alignItems":"center","gap":"11px"};
const st186 = {"flex":"1","height":"6px","borderRadius":"999px","background":"var(--border)","overflow":"hidden"};
const st187 = {"background":"#FAFAFC","border":"1px solid var(--border)","borderRadius":"18px","padding":"20px","display":"flex","flexDirection":"column","gap":"2px"};
const st188 = {"display":"flex","alignItems":"center","justifyContent":"space-between","gap":"12px","marginBottom":"6px"};
const st189 = {"fontSize":"15px","fontWeight":"700","letterSpacing":"-0.01em","color":"var(--text-3)"};
const st190 = {"padding":"4px 10px","borderRadius":"999px","background":"#F1F0F5","color":"var(--text-3)","fontSize":"11px","fontWeight":"700","textTransform":"uppercase","letterSpacing":"0.05em"};
const st191 = {"display":"flex","alignItems":"center","justifyContent":"space-between","gap":"16px","padding":"11px 0","borderTop":"1px solid var(--border)","opacity":"0.55"};
const st192 = {"fontSize":"13.5px","fontWeight":"600","color":"var(--text-2)"};
const st193 = {"fontSize":"12.5px","color":"var(--text-3)","marginTop":"2px"};
const st194 = {"position":"relative","width":"42px","height":"24px","flex":"none","borderRadius":"999px","background":"var(--border-2)"};
const st195 = {"position":"absolute","top":"3px","left":"3px","width":"18px","height":"18px","borderRadius":"50%","background":"#fff","boxShadow":"0 1px 3px rgba(30,20,60,0.15)"};
const st196 = {"background":"var(--card)","border":"1px solid var(--border)","borderRadius":"18px","padding":"20px","boxShadow":"0 1px 8px rgba(30,20,60,0.04)","display":"flex","alignItems":"center","justifyContent":"space-between","gap":"16px"};
const st197 = {"display":"flex","alignItems":"center","gap":"8px","flex":"none","padding":"8px 14px","borderRadius":"999px","background":"var(--secondary-soft)","color":"var(--secondary)","fontSize":"13px","fontWeight":"700"};
const st198 = {"flex":"none","padding":"10px 18px","border":"none","borderRadius":"11px","background":"var(--primary)","color":"#fff","fontSize":"13px","fontWeight":"600","fontFamily":"inherit","cursor":"pointer"};
const st199 = {"background":"var(--neg-soft)","border":"1px solid #F2CFCF","borderRadius":"18px","padding":"20px","display":"flex","alignItems":"center","justifyContent":"space-between","gap":"16px"};
const st200 = {"fontSize":"15px","fontWeight":"700","letterSpacing":"-0.01em","color":"var(--neg)"};
const st201 = {"fontSize":"13px","color":"var(--text-2)","marginTop":"3px"};
const st202 = {"flex":"none","padding":"10px 18px","border":"1px solid var(--neg)","borderRadius":"11px","background":"transparent","color":"var(--neg)","fontSize":"13px","fontWeight":"600","fontFamily":"inherit","cursor":"pointer"};
const st203 = {"display":"flex","flexDirection":"column","gap":"16px","padding":"22px 32px 48px"};
const st204 = {"display":"flex","alignItems":"center","gap":"10px","flexWrap":"wrap"};
const st205 = {"display":"flex","alignItems":"center","gap":"6px","fontSize":"13.5px","fontWeight":"700"};
const st206 = {"padding":"4px 6px","color":"var(--text)"};
const st207 = {"width":"200px","padding":"9px 13px","border":"1px solid var(--border-2)","borderRadius":"12px","background":"var(--card)","fontFamily":"inherit","fontSize":"13px","color":"var(--text)","outline":"none"};
const st208 = {"display":"flex","alignItems":"center","gap":"7px","padding":"9px 14px","border":"1px solid var(--border-2)","borderRadius":"12px","background":"var(--card)","color":"var(--text-2)","fontSize":"13px","fontWeight":"600","fontFamily":"inherit","cursor":"pointer"};
const st209 = {"display":"flex","alignItems":"center","gap":"7px","padding":"9px 15px","border":"none","borderRadius":"12px","background":"var(--primary)","color":"#fff","fontSize":"13px","fontWeight":"600","fontFamily":"inherit","cursor":"pointer"};
const st210 = {"display":"flex","gap":"2px","background":"#F4F3F7","borderRadius":"11px","padding":"3px"};
const st211 = {"display":"flex","alignItems":"center","gap":"8px","flexWrap":"wrap"};
const st212 = {"fontSize":"11px","fontWeight":"700","opacity":"0.65"};
const st213 = {"display":"grid","gridTemplateColumns":"repeat(auto-fill,minmax(210px,1fr))","gap":"14px"};
const st214 = {"fontSize":"13.5px","fontWeight":"600","lineHeight":"1.35","wordBreak":"break-word"};
const st215 = {"fontSize":"11.5px","color":"var(--text-3)","marginTop":"3px","fontWeight":"500"};
const st216 = {"display":"flex","opacity":"0.7"};
const st217 = {"position":"absolute","left":"0","right":"0","top":"34px","zIndex":"31","background":"var(--card)","border":"1px solid var(--border)","borderRadius":"14px","boxShadow":"0 16px 40px rgba(30,20,60,0.18)","padding":"6px","display":"flex","flexDirection":"column","gap":"2px"};
const st218 = {"display":"flex","gap":"4px"};
const st219 = {"flex":"1","padding":"6px","border":"1px solid var(--border)","borderRadius":"9px","background":"var(--card)","color":"var(--text-2)","cursor":"pointer","display":"flex","alignItems":"center","justifyContent":"center"};
const st220 = {"flex":"1","padding":"6px","border":"1px solid var(--border)","borderRadius":"9px","background":"var(--card)","color":"var(--text-3)","cursor":"pointer","display":"flex","alignItems":"center","justifyContent":"center"};
const st221 = {"background":"var(--card)","border":"1px solid var(--border)","borderRadius":"16px","overflow":"hidden"};
const st222 = {"fontSize":"12px","color":"var(--text-3)","fontWeight":"500","width":"160px","textAlign":"right"};
const st223 = {"padding":"6px","border":"1px solid var(--border)","borderRadius":"9px","background":"var(--card)","color":"var(--text-2)","cursor":"pointer","display":"flex"};
const st224 = {"padding":"6px","border":"1px solid var(--border)","borderRadius":"9px","background":"var(--card)","color":"var(--text-3)","cursor":"pointer","display":"flex"};
const st225 = {"display":"flex","flexDirection":"column","alignItems":"center","justifyContent":"center","padding":"80px 20px","textAlign":"center"};
const st226 = {"width":"58px","height":"58px","borderRadius":"17px","background":"var(--primary-soft)","color":"var(--primary-2)","display":"flex","alignItems":"center","justifyContent":"center"};
const st227 = {"fontSize":"15.5px","fontWeight":"700","marginTop":"16px"};
const st228 = {"fontSize":"13.5px","color":"var(--text-3)","marginTop":"6px","maxWidth":"340px","lineHeight":"1.55"};
const st229 = {"fontSize":"12px","color":"var(--text-3)","fontWeight":"500"};
const st230 = {"width":"400px","maxWidth":"92vw","background":"var(--card)","borderRadius":"20px","boxShadow":"0 24px 60px rgba(30,20,60,0.24)","padding":"22px","display":"flex","flexDirection":"column","gap":"14px"};
const st231 = {"padding":"11px 13px","border":"1px solid var(--border-2)","borderRadius":"12px","fontFamily":"inherit","fontSize":"14px","color":"var(--text)","outline":"none"};
const st232 = {"display":"flex","justifyContent":"flex-end","gap":"8px"};
const st233 = {"position":"fixed","inset":"0","zIndex":"40","background":"rgba(20,12,40,0.66)","display":"flex","alignItems":"center","justifyContent":"center","padding":"30px"};
const st234 = {"width":"520px","maxWidth":"94vw","background":"var(--card)","borderRadius":"22px","boxShadow":"0 28px 70px rgba(20,12,40,0.4)","overflow":"hidden","display":"flex","flexDirection":"column"};
const st235 = {"background":"#0E0A1A","display":"flex","alignItems":"center","justifyContent":"center","minHeight":"280px"};
const st236 = {"padding":"16px 20px","display":"flex","alignItems":"center","gap":"12px","flexWrap":"wrap"};
const st237 = {"flex":"1","minWidth":"180px"};
const st238 = {"fontSize":"14.5px","fontWeight":"700","wordBreak":"break-word"};
const st239 = {"fontSize":"12px","color":"var(--text-3)","marginTop":"3px","fontWeight":"500"};
const st240 = {"padding":"9px 14px","border":"none","borderRadius":"11px","background":"var(--primary)","color":"#fff","fontSize":"13px","fontWeight":"600","fontFamily":"inherit","cursor":"pointer"};
const st241 = {"width":"210px","padding":"9px 13px","border":"1px solid var(--border-2)","borderRadius":"12px","background":"var(--card)","fontFamily":"inherit","fontSize":"13px","color":"var(--text)","outline":"none"};
const st242 = {"display":"grid","gridTemplateColumns":"repeat(auto-fill,minmax(200px,1fr))","gap":"14px"};
const st243 = {"fontSize":"12px","color":"var(--text-3)","fontWeight":"500","width":"170px","textAlign":"right"};
const st244 = {"padding":"16px 20px","display":"flex","alignItems":"center","gap":"14px"};
const st245 = {"padding":"9px 14px","border":"1px solid var(--border-2)","borderRadius":"11px","background":"var(--card)","color":"var(--text-2)","fontSize":"13px","fontWeight":"600","fontFamily":"inherit","cursor":"pointer"};
const st246 = {"display":"flex","flexDirection":"column","gap":"14px","padding":"22px 32px 28px","maxWidth":"1080px"};
const st247 = {"display":"flex","alignItems":"center","gap":"7px","fontSize":"12px","fontWeight":"600","color":"var(--text-3)"};
const st248 = {"width":"7px","height":"7px","borderRadius":"50%","background":"var(--green)","display":"inline-block"};
const st249 = {"fontSize":"12px","fontWeight":"600","color":"var(--text-2)","background":"var(--primary-softer)","border":"1px solid var(--border-2)","borderRadius":"999px","padding":"4px 11px"};
const st250 = {"padding":"7px 13px","border":"1px solid var(--border-2)","borderRadius":"11px","background":"var(--card)","color":"var(--text-2)","fontSize":"12.5px","fontWeight":"600","fontFamily":"inherit","cursor":"pointer"};
const st251 = {"background":"var(--card)","border":"1px solid var(--border)","borderRadius":"20px","boxShadow":"0 1px 8px rgba(30,20,60,0.04)","padding":"22px","display":"flex","flexDirection":"column","gap":"16px","minHeight":"400px","maxHeight":"56vh","overflowY":"auto"};
const st252 = {"display":"flex","flexDirection":"column","gap":"18px","padding":"14px 4px"};
const st253 = {"width":"46px","height":"46px","flex":"none","borderRadius":"14px","background":"linear-gradient(135deg,var(--primary),var(--secondary))","color":"#fff","display":"flex","alignItems":"center","justifyContent":"center"};
const st254 = {"fontSize":"17px","fontWeight":"700","letterSpacing":"-0.02em"};
const st255 = {"fontSize":"13.5px","color":"var(--text-3)","marginTop":"3px"};
const st256 = {"display":"grid","gridTemplateColumns":"repeat(auto-fit,minmax(230px,1fr))","gap":"10px"};
const st257 = {"textAlign":"left","padding":"13px 15px","border":"1px solid var(--border-2)","borderRadius":"14px","background":"var(--bg)","color":"var(--text)","fontSize":"13.5px","fontWeight":"600","lineHeight":"1.45","fontFamily":"inherit","cursor":"pointer"};
const st258 = {"maxWidth":"80%","display":"flex","flexDirection":"column","gap":"6px"};
const st259 = {"display":"flex","alignItems":"center","gap":"9px","fontSize":"13px","color":"var(--primary-2)","fontWeight":"600"};
const st260 = {"fontSize":"13px","color":"var(--neg)","fontWeight":"600"};
const st261 = {"background":"var(--card)","border":"1px solid var(--border-2)","borderRadius":"18px","padding":"14px 16px","display":"flex","flexDirection":"column","gap":"10px","boxShadow":"0 1px 8px rgba(30,20,60,0.04)"};
const st262 = {"width":"100%","minHeight":"52px","border":"none","outline":"none","resize":"vertical","fontFamily":"inherit","fontSize":"14px","lineHeight":"1.55","color":"var(--text)","background":"transparent"};
const st263 = {"display":"flex","alignItems":"center","justifyContent":"space-between","gap":"10px"};
const st264 = {"fontSize":"11.5px","color":"var(--text-3)","fontWeight":"500"};
const st265 = {"display":"flex","flexDirection":"column","alignItems":"center","justifyContent":"center","padding":"90px 20px","textAlign":"center"};
const st266 = {"width":"64px","height":"64px","borderRadius":"18px","background":"var(--primary-soft)","color":"var(--primary-2)","display":"flex","alignItems":"center","justifyContent":"center"};
const st267 = {"fontSize":"17px","fontWeight":"700","color":"var(--text)","marginTop":"18px"};
const st268 = {"fontSize":"14px","color":"var(--text-3)","marginTop":"6px","maxWidth":"380px","lineHeight":"1.5"};
const st269 = {"color":"var(--text-2)"};

/**
 * Rend le template du design à partir de `V`, l'objet plat produit par
 * `{ ...props, ...logic.renderVals() }` — exactement comme le runtime d'origine.
 */
export default function View(V) {
  return (
    <div ref={V.rootRef} style={st0}>
      <aside style={st1}>
        <div style={st2}>
          <div style={st3}>
            {"T"}
          </div>
          <div>
            <div style={st4}>
              {"TTS Manager"}
            </div>
            <div style={st5}>
              {"Creator Revenue Studio"}
            </div>
          </div>
        </div>
        <nav style={st6}>
          {(V.navGroups || []).map((g, _i5) => (
            <React.Fragment key={_i5}>
              <div style={st7}>
                <div style={st8}>
                  {g.label}
                </div>
                {(g.items || []).map((item, _i8) => (
                  <React.Fragment key={_i8}>
                    <button onClick={item.onClick} style={css(`display:flex;align-items:center;gap:12px;width:100%;padding:10px 12px;border:none;border-radius:11px;cursor:pointer;font-size:13.5px;font-weight:600;text-align:left;transition:background .15s,color .15s;background:${item.bg ?? ""};color:${item.fg ?? ""};`)} className={sp("hover", "background:var(--primary-softer)")}>
                      <span style={st9}>
                        {item.icon}
                      </span>
                      {" "}
                      <span style={st10}>
                        {item.label}
                      </span>
                      {" "}
                      {item.badge ? (
                        <React.Fragment>
                          <span style={st11}>
                            {item.badge}
                          </span>
                        </React.Fragment>
                      ) : null}
                    </button>
                  </React.Fragment>
                ))}
              </div>
            </React.Fragment>
          ))}
          <button onClick={V.assistantItem.onClick} style={css(`display:flex;align-items:center;gap:12px;width:100%;padding:11px 12px;border:1px solid ${V.assistantItem.border ?? ""};border-radius:12px;cursor:pointer;font-size:13.5px;font-weight:700;text-align:left;transition:filter .15s;background:${V.assistantItem.bg ?? ""};color:${V.assistantItem.fg ?? ""};box-shadow:0 2px 10px rgba(124,92,246,0.22);`)} className={sp("hover", "filter:brightness(1.06)")}>
            <span style={st9}>
              {V.assistantItem.icon}
            </span>
            {" "}
            <span style={st10}>
              {"Ton assistant perso"}
            </span>
          </button>
        </nav>
        <div style={st10}></div>
        <button onClick={V.settingsItem.onClick} style={css(`display:flex;align-items:center;gap:12px;width:100%;padding:10px 12px;margin-bottom:10px;border:1px solid ${V.settingsItem.border ?? ""};border-radius:13px;cursor:pointer;font-size:13.5px;font-weight:600;text-align:left;background:${V.settingsItem.bg ?? ""};color:${V.settingsItem.fg ?? ""};`)}>
          <span style={st9}>
            {V.settingsItem.icon}
          </span>
          {" "}
          <span style={st10}>
            {V.settingsItem.label}
          </span>
        </button>
        <div style={st12}>
          <div style={st13}>
            {"CL"}
          </div>
          <div style={st14}>
            <div style={st15}>
              {"Camille Léon"}
            </div>
            <div style={st16}>
              {"Créatrice · Pro"}
            </div>
          </div>
        </div>
      </aside>
      <main style={st17}>
        <header style={st18}>
          <div>
            <div style={st19}>
              {V.pageTitle}
            </div>
            <div style={st20}>
              {V.pageSubtitle}
            </div>
          </div>
          {V.showPeriod ? (
            <React.Fragment>
              <div style={st21}>
                <button onClick={V.togglePeriod} style={st22} className={sp("hover", "border-color:var(--primary)")}>
                  <span style={st23}>
                    {V.calendarIcon}
                  </span>
                  {" "}
                  <span>
                    {V.periodLabel}
                  </span>
                  {" "}
                  <span style={st24}>
                    {V.chevronIcon}
                  </span>
                </button>
                {V.periodOpen ? (
                  <React.Fragment>
                    <div onClick={V.closePeriod} style={st25}></div>
                    <div onClick={V.stopProp} style={st26}>
                      <div style={st27}>
                        <div style={st28}>
                          {"Périodes"}
                        </div>
                        {(V.periodOptions || []).map((p, _i12) => (
                          <React.Fragment key={_i12}>
                            <button onClick={p.onClick} style={css(`display:flex;align-items:center;justify-content:space-between;gap:8px;width:100%;padding:8px 10px;border:none;border-radius:9px;cursor:pointer;font-size:13px;font-weight:600;text-align:left;font-family:inherit;background:${p.bg ?? ""};color:${p.fg ?? ""};`)} className={sp("hover", "background:var(--primary-soft);color:var(--primary-2)")}>
                              <span>
                                {p.label}
                              </span>
                              {" "}
                              {p.active ? (
                                <React.Fragment>
                                  <span style={st23}>
                                    {V.checkIcon}
                                  </span>
                                </React.Fragment>
                              ) : null}
                            </button>
                          </React.Fragment>
                        ))}
                      </div>
                      <div style={st29}>
                        <div style={st30}>
                          <button onClick={V.dpPrev} style={st31} className={sp("hover", "border-color:var(--primary);color:var(--primary-2)")}>
                            {"‹"}
                          </button>
                          <div style={st32}>
                            {V.dpMonthLabel}
                          </div>
                          <button onClick={V.dpNext} style={st31} className={sp("hover", "border-color:var(--primary);color:var(--primary-2)")}>
                            {"›"}
                          </button>
                        </div>
                        <div style={st33}>
                          <div style={st34}>
                            {"LU"}
                          </div>
                          <div style={st34}>
                            {"MA"}
                          </div>
                          <div style={st34}>
                            {"ME"}
                          </div>
                          <div style={st34}>
                            {"JE"}
                          </div>
                          <div style={st34}>
                            {"VE"}
                          </div>
                          <div style={st34}>
                            {"SA"}
                          </div>
                          <div style={st34}>
                            {"DI"}
                          </div>
                        </div>
                        <div style={st35}>
                          {(V.dpCells || []).map((c, _i13) => (
                            <React.Fragment key={_i13}>
                              <button onClick={c.onClick} style={css(`height:38px;border:${c.ring ?? ""};background:${c.bg ?? ""};color:${c.fg ?? ""};font-weight:${c.weight ?? ""};border-radius:${c.radius ?? ""};font-size:13px;cursor:pointer;font-family:inherit;`)}>
                                {c.label}
                              </button>
                            </React.Fragment>
                          ))}
                        </div>
                        <div style={st36}>
                          <div style={st37}>
                            {V.dpSelLabel}
                          </div>
                          <button onClick={V.applyPeriodRange} disabled={V.dpDisabled} style={css(`padding:9px 18px;border:none;border-radius:11px;background:var(--primary);color:#fff;font-size:12px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;cursor:pointer;font-family:inherit;opacity:${V.dpApplyOpacity ?? ""};`)} className={sp("hover", "background:var(--primary-2)")}>
                            {"Appliquer"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                ) : null}
              </div>
            </React.Fragment>
          ) : null}
          {" "}
          {V.isCommandes ? (
            <React.Fragment>
              <div style={st38}>
                <select value={V.fVendeur ?? ""} onChange={V.setFVendeur} style={st39} className={sp("hover", "border-color:var(--primary)")}>
                  {(V.vendeurOptions || []).map((o, _i9) => (
                    <React.Fragment key={_i9}>
                      <option value={o ?? ""}>
                        {o}
                      </option>
                    </React.Fragment>
                  ))}
                </select>
                <select value={V.fStatut ?? ""} onChange={V.setFStatut} style={st40} className={sp("hover", "border-color:var(--primary)")}>
                  {(V.statutOptions || []).map((o, _i9) => (
                    <React.Fragment key={_i9}>
                      <option value={o ?? ""}>
                        {o}
                      </option>
                    </React.Fragment>
                  ))}
                </select>
                <div style={st21}>
                  <button onClick={V.toggleDp} style={st41} className={sp("hover", "border-color:var(--primary)")}>
                    <span style={st23}>
                      {V.calendarIcon}
                    </span>
                    {" "}
                    <span>
                      {V.dpLabel}
                    </span>
                    {" "}
                    <span style={st24}>
                      {V.chevronIcon}
                    </span>
                  </button>
                  {V.dpOpen ? (
                    <React.Fragment>
                      <div onClick={V.closeDp} style={st25}></div>
                      <div onClick={V.stopProp} style={st26}>
                        <div style={st27}>
                          <div style={st28}>
                            {"Raccourcis"}
                          </div>
                          {(V.dpShortcuts || []).map((s, _i13) => (
                            <React.Fragment key={_i13}>
                              <button onClick={s.onClick} style={st42} className={sp("hover", "background:var(--primary-soft);color:var(--primary-2)")}>
                                {s.label}
                              </button>
                            </React.Fragment>
                          ))}
                        </div>
                        <div style={st29}>
                          <div style={st30}>
                            <button onClick={V.dpPrev} style={st31} className={sp("hover", "border-color:var(--primary);color:var(--primary-2)")}>
                              {"‹"}
                            </button>
                            <div style={st32}>
                              {V.dpMonthLabel}
                            </div>
                            <button onClick={V.dpNext} style={st31} className={sp("hover", "border-color:var(--primary);color:var(--primary-2)")}>
                              {"›"}
                            </button>
                          </div>
                          <div style={st33}>
                            <div style={st34}>
                              {"LU"}
                            </div>
                            <div style={st34}>
                              {"MA"}
                            </div>
                            <div style={st34}>
                              {"ME"}
                            </div>
                            <div style={st34}>
                              {"JE"}
                            </div>
                            <div style={st34}>
                              {"VE"}
                            </div>
                            <div style={st34}>
                              {"SA"}
                            </div>
                            <div style={st34}>
                              {"DI"}
                            </div>
                          </div>
                          <div style={st35}>
                            {(V.dpCells || []).map((c, _i14) => (
                              <React.Fragment key={_i14}>
                                <button onClick={c.onClick} style={css(`height:38px;border:${c.ring ?? ""};background:${c.bg ?? ""};color:${c.fg ?? ""};font-weight:${c.weight ?? ""};border-radius:${c.radius ?? ""};font-size:13px;cursor:pointer;font-family:inherit;`)}>
                                  {c.label}
                                </button>
                              </React.Fragment>
                            ))}
                          </div>
                          <div style={st36}>
                            <div style={st37}>
                              {V.dpSelLabel}
                            </div>
                            <button onClick={V.dpApply} disabled={V.dpDisabled} style={css(`padding:9px 18px;border:none;border-radius:11px;background:var(--primary);color:#fff;font-size:12px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;cursor:pointer;font-family:inherit;opacity:${V.dpApplyOpacity ?? ""};`)} className={sp("hover", "background:var(--primary-2)")}>
                              {"Appliquer"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  ) : null}
                </div>
                {V.filtersActive ? (
                  <React.Fragment>
                    <button onClick={V.resetFilters} style={st43} className={sp("hover", "background:var(--primary-softer);color:var(--primary-2)")}>
                      {"Réinitialiser"}
                    </button>
                  </React.Fragment>
                ) : null}
              </div>
            </React.Fragment>
          ) : null}
        </header>
        {V.isDashboard ? (
          <React.Fragment>
            <div style={st44}>
              {V.tiktokOff ? (
                <React.Fragment>
                  <div style={st45}>
                    <span style={st46}>
                      {V.tiktokIcon}
                    </span>
                    <div style={st47}>
                      {"Ton compte TikTok Shop n'est pas connecté — les données affichées sont des estimations."}
                    </div>
                  </div>
                </React.Fragment>
              ) : null}
              <div style={st48}>
                {(V.dashKpis || []).map((k, _i8) => (
                  <React.Fragment key={_i8}>
                    <div style={st49}>
                      <div style={st50}>
                        <div style={css(`width:44px;height:44px;border-radius:13px;display:flex;align-items:center;justify-content:center;background:${k.iconBg ?? ""};color:${k.iconFg ?? ""};`)}>
                          {k.icon}
                        </div>
                        {k.trend ? (
                          <React.Fragment>
                            <div style={css(`display:inline-flex;align-items:center;gap:2px;font-size:12px;font-weight:700;padding:3px 8px 3px 6px;border-radius:999px;background:${k.trendBg ?? ""};color:${k.trendFg ?? ""};`)}>
                              {k.trendIcon}{k.trend}
                            </div>
                          </React.Fragment>
                        ) : null}
                      </div>
                      <div style={st51}>
                        {k.label}
                      </div>
                      <div style={st52}>
                        {k.value}
                      </div>
                      {k.sub ? (
                        <React.Fragment>
                          <div style={st53}>
                            {k.sub}
                          </div>
                        </React.Fragment>
                      ) : null}
                    </div>
                  </React.Fragment>
                ))}
              </div>
              <div style={st54}>
                <div style={st55}>
                  <div style={st56}>
                    <div style={st57}>
                      {"Évolution CA & Commissions"}
                    </div>
                    <div style={st58}>
                      <span style={st59}>
                        <span style={st60}></span>
                        {"CA"}
                      </span>
                      {" "}
                      <span style={st59}>
                        <span style={st61}></span>
                        {"Commissions"}
                      </span>
                    </div>
                  </div>
                  {" "}{V.lineChart}{" "}
                </div>
                <div style={st62}>
                  <div style={st56}>
                    <div style={st57}>
                      {"Top Produits"}
                    </div>
                    <div style={st63}>
                      <button onClick={V.topToggle.ca.onClick} style={css(`padding:5px 11px;border:none;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600;background:${V.topToggle.ca.bg ?? ""};color:${V.topToggle.ca.fg ?? ""};`)}>
                        {"CA"}
                      </button>
                      <button onClick={V.topToggle.com.onClick} style={css(`padding:5px 11px;border:none;border-radius:8px;cursor:pointer;font-size:12px;font-weight:600;background:${V.topToggle.com.bg ?? ""};color:${V.topToggle.com.fg ?? ""};`)}>
                        {"Commissions"}
                      </button>
                    </div>
                  </div>
                  {(V.topProduits || []).map((t, _i9) => (
                    <React.Fragment key={_i9}>
                      <div style={st64}>
                        <div style={css(`width:26px;height:26px;flex:none;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:12.5px;font-weight:700;background:${t.rankBg ?? ""};color:${t.rankFg ?? ""};`)}>
                          {t.rank}
                        </div>
                        <div style={st14}>
                          <div style={st65}>
                            {t.name}
                          </div>
                          <div style={st66}>
                            {t.ventes}{" ventes"}
                          </div>
                        </div>
                        <div style={st67}>
                          {t.amount}
                        </div>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
              <div style={st62}>
                <div style={st68}>
                  <div style={st57}>
                    {"File de travail"}
                  </div>
                  <div style={st69}>
                    {V.fileCount}{" vidéos en production"}
                  </div>
                </div>
                {(V.fileDeTravail || []).map((f, _i8) => (
                  <React.Fragment key={_i8}>
                    <div style={st70}>
                      <div>
                        <span style={css(`display:inline-flex;align-items:center;padding:4px 10px;border-radius:999px;font-size:11.5px;font-weight:600;background:${f.badgeBg ?? ""};color:${f.badgeFg ?? ""};`)}>
                          {f.statut}
                        </span>
                      </div>
                      <div style={st71}>
                        <div style={st65}>
                          {f.titre}
                        </div>
                        <div style={st66}>
                          {f.produit}
                        </div>
                      </div>
                      <div style={st24}>
                        {V.chevronRightIcon}
                      </div>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </React.Fragment>
        ) : null}
        {V.isAnalytics ? (
          <React.Fragment>
            <div style={st72}>
              <div style={st73}>
                {(V.analyticsTabs || []).map((tb, _i8) => (
                  <React.Fragment key={_i8}>
                    <button onClick={tb.onClick} style={css(`padding:11px 18px;border:none;background:none;cursor:pointer;font-size:14px;font-weight:600;color:${tb.color ?? ""};border-bottom:2px solid ${tb.border ?? ""};margin-bottom:-1px;`)}>
                      {tb.label}
                    </button>
                  </React.Fragment>
                ))}
              </div>
              {V.isCompte ? (
                <React.Fragment>
                  <div style={st6}>
                    <div style={st74}>
                      {(V.compteKpis || []).map((k, _i11) => (
                        <React.Fragment key={_i11}>
                          <div style={st49}>
                            <div style={st50}>
                              <div style={css(`width:42px;height:42px;border-radius:12px;display:flex;align-items:center;justify-content:center;background:${k.iconBg ?? ""};color:${k.iconFg ?? ""};`)}>
                                {k.icon}
                              </div>
                              {k.trend ? (
                                <React.Fragment>
                                  <div style={css(`display:inline-flex;align-items:center;gap:2px;font-size:12px;font-weight:700;padding:3px 8px 3px 6px;border-radius:999px;background:${k.trendBg ?? ""};color:${k.trendFg ?? ""};`)}>
                                    {k.trendIcon}{k.trend}
                                  </div>
                                </React.Fragment>
                              ) : null}
                            </div>
                            <div style={st75}>
                              {k.label}
                            </div>
                            <div style={st76}>
                              {k.value}
                            </div>
                            {k.sub ? (
                              <React.Fragment>
                                <div style={st53}>
                                  {k.sub}
                                </div>
                              </React.Fragment>
                            ) : null}
                          </div>
                        </React.Fragment>
                      ))}
                    </div>
                    {V.isEligLow ? (
                      <React.Fragment>
                        <div style={st77}>
                          <span style={st78}>
                            {V.alertIcon}
                          </span>
                          <div style={st79}>
                            <span style={st80}>
                              {V.eligPct}{" d'éligibilité"}
                            </span>
                            {" — "}{V.eligCount}{" commandes inéligibles sur la période."}
                          </div>
                        </div>
                      </React.Fragment>
                    ) : null}
                    <div style={st81}>
                      <div style={st55}>
                        <div style={st82}>
                          <div style={st57}>
                            {"Évolution CA & Commissions"}
                          </div>
                          <div style={st58}>
                            <span style={st59}>
                              <span style={st60}></span>
                              {"CA"}
                            </span>
                            {" "}
                            <span style={st59}>
                              <span style={st61}></span>
                              {"Commissions"}
                            </span>
                          </div>
                        </div>
                        {" "}{V.lineChart}{" "}
                      </div>
                      <div style={st62}>
                        <div style={st83}>
                          {"Type de commandes"}
                        </div>
                        {" "}{V.donut}{" "}
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              ) : null}
              {" "}
              {V.isMarques ? (
                <React.Fragment>
                  <div style={st84}>
                    <table style={st85}>
                      <thead>
                        <tr style={st86}>
                          <th style={st87} onClick={V.marquesSort.name.onClick}>
                            <span style={css(`color:${V.marquesSort.name.color ?? ""}`)}>
                              {"Marque"}{V.marquesSort.name.arrow}
                            </span>
                          </th>
                          <th style={st88} onClick={V.marquesSort.orders.onClick}>
                            <span style={css(`color:${V.marquesSort.orders.color ?? ""}`)}>
                              {"Commandes"}{V.marquesSort.orders.arrow}
                            </span>
                          </th>
                          <th style={st88} onClick={V.marquesSort.ca.onClick}>
                            <span style={css(`color:${V.marquesSort.ca.color ?? ""}`)}>
                              {"CA"}{V.marquesSort.ca.arrow}
                            </span>
                          </th>
                          <th style={st88} onClick={V.marquesSort.com.onClick}>
                            <span style={css(`color:${V.marquesSort.com.color ?? ""}`)}>
                              {"Commissions"}{V.marquesSort.com.arrow}
                            </span>
                          </th>
                          <th style={st88} onClick={V.marquesSort.taux.onClick}>
                            <span style={css(`color:${V.marquesSort.taux.color ?? ""}`)}>
                              {"Taux"}{V.marquesSort.taux.arrow}
                            </span>
                          </th>
                          <th style={st88} onClick={V.marquesSort.panier.onClick}>
                            <span style={css(`color:${V.marquesSort.panier.color ?? ""}`)}>
                              {"Panier moyen"}{V.marquesSort.panier.arrow}
                            </span>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {(V.marquesRows || []).map((r, _i12) => (
                          <React.Fragment key={_i12}>
                            <tr style={st86} className={sp("hover", "background:var(--primary-softer)")}>
                              <td style={st89}>
                                {r.name}
                              </td>
                              <td style={st90}>
                                {r.orders}
                              </td>
                              <td style={st91}>
                                {r.ca}
                              </td>
                              <td style={st92}>
                                {r.com}
                              </td>
                              <td style={st93}>
                                <span style={css(`display:inline-block;padding:3px 9px;border-radius:999px;font-size:11.5px;font-weight:700;background:${r.tauxBg ?? ""};color:${r.tauxFg ?? ""};`)}>
                                  {r.tauxStr}
                                </span>
                              </td>
                              <td style={st90}>
                                {r.panier}
                              </td>
                            </tr>
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </React.Fragment>
              ) : null}
              {" "}
              {V.isProduits ? (
                <React.Fragment>
                  <div style={st84}>
                    <table style={st85}>
                      <thead>
                        <tr style={st86}>
                          <th style={st87} onClick={V.produitsSort.name.onClick}>
                            <span style={css(`color:${V.produitsSort.name.color ?? ""}`)}>
                              {"Produit"}{V.produitsSort.name.arrow}
                            </span>
                          </th>
                          <th style={st87} onClick={V.produitsSort.boutique.onClick}>
                            <span style={css(`color:${V.produitsSort.boutique.color ?? ""}`)}>
                              {"Boutique"}{V.produitsSort.boutique.arrow}
                            </span>
                          </th>
                          <th style={st88} onClick={V.produitsSort.orders.onClick}>
                            <span style={css(`color:${V.produitsSort.orders.color ?? ""}`)}>
                              {"Commandes"}{V.produitsSort.orders.arrow}
                            </span>
                          </th>
                          <th style={st88} onClick={V.produitsSort.ca.onClick}>
                            <span style={css(`color:${V.produitsSort.ca.color ?? ""}`)}>
                              {"CA"}{V.produitsSort.ca.arrow}
                            </span>
                          </th>
                          <th style={st88} onClick={V.produitsSort.com.onClick}>
                            <span style={css(`color:${V.produitsSort.com.color ?? ""}`)}>
                              {"Commissions"}{V.produitsSort.com.arrow}
                            </span>
                          </th>
                          <th style={st88} onClick={V.produitsSort.taux.onClick}>
                            <span style={css(`color:${V.produitsSort.taux.color ?? ""}`)}>
                              {"Taux"}{V.produitsSort.taux.arrow}
                            </span>
                          </th>
                          <th style={st88} onClick={V.produitsSort.panier.onClick}>
                            <span style={css(`color:${V.produitsSort.panier.color ?? ""}`)}>
                              {"Panier moyen"}{V.produitsSort.panier.arrow}
                            </span>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {(V.produitsRows || []).map((r, _i12) => (
                          <React.Fragment key={_i12}>
                            <tr style={st86} className={sp("hover", "background:var(--primary-softer)")}>
                              <td style={st89}>
                                {r.name}
                              </td>
                              <td style={st94}>
                                {r.boutique}
                              </td>
                              <td style={st90}>
                                {r.orders}
                              </td>
                              <td style={st91}>
                                {r.ca}
                              </td>
                              <td style={st92}>
                                {r.com}
                              </td>
                              <td style={st93}>
                                <span style={css(`display:inline-block;padding:3px 9px;border-radius:999px;font-size:11.5px;font-weight:700;background:${r.tauxBg ?? ""};color:${r.tauxFg ?? ""};`)}>
                                  {r.tauxStr}
                                </span>
                              </td>
                              <td style={st90}>
                                {r.panier}
                              </td>
                            </tr>
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </React.Fragment>
              ) : null}
              {" "}
              {V.isVideos ? (
                <React.Fragment>
                  <div style={st84}>
                    <table style={st85}>
                      <thead>
                        <tr style={st86}>
                          <th style={st87} onClick={V.videosSort.titre.onClick}>
                            <span style={css(`color:${V.videosSort.titre.color ?? ""}`)}>
                              {"Vidéo"}{V.videosSort.titre.arrow}
                            </span>
                          </th>
                          <th style={st87} onClick={V.videosSort.produit.onClick}>
                            <span style={css(`color:${V.videosSort.produit.color ?? ""}`)}>
                              {"Produit"}{V.videosSort.produit.arrow}
                            </span>
                          </th>
                          <th style={st88} onClick={V.videosSort.vues.onClick}>
                            <span style={css(`color:${V.videosSort.vues.color ?? ""}`)}>
                              {"Vues"}{V.videosSort.vues.arrow}
                            </span>
                          </th>
                          <th style={st88} onClick={V.videosSort.orders.onClick}>
                            <span style={css(`color:${V.videosSort.orders.color ?? ""}`)}>
                              {"Commandes"}{V.videosSort.orders.arrow}
                            </span>
                          </th>
                          <th style={st88} onClick={V.videosSort.ca.onClick}>
                            <span style={css(`color:${V.videosSort.ca.color ?? ""}`)}>
                              {"CA"}{V.videosSort.ca.arrow}
                            </span>
                          </th>
                          <th style={st88} onClick={V.videosSort.com.onClick}>
                            <span style={css(`color:${V.videosSort.com.color ?? ""}`)}>
                              {"Commissions"}{V.videosSort.com.arrow}
                            </span>
                          </th>
                          <th style={st88} onClick={V.videosSort.conv.onClick}>
                            <span style={css(`color:${V.videosSort.conv.color ?? ""}`)}>
                              {"Conversion"}{V.videosSort.conv.arrow}
                            </span>
                          </th>
                          <th style={st88} onClick={V.videosSort.revvue.onClick}>
                            <span style={css(`color:${V.videosSort.revvue.color ?? ""}`)}>
                              {"€ / vue"}{V.videosSort.revvue.arrow}
                            </span>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {(V.videosRows || []).map((r, _i12) => (
                          <React.Fragment key={_i12}>
                            <tr style={st86} className={sp("hover", "background:var(--primary-softer)")}>
                              <td style={st89}>
                                {r.titre}
                              </td>
                              <td style={st94}>
                                {r.produit}
                              </td>
                              <td style={st90}>
                                {r.vues}
                              </td>
                              <td style={st90}>
                                {r.orders}
                              </td>
                              <td style={st91}>
                                {r.ca}
                              </td>
                              <td style={st92}>
                                {r.com}
                              </td>
                              <td style={st93}>
                                <span style={css(`display:inline-block;padding:3px 9px;border-radius:999px;font-size:11.5px;font-weight:700;background:${r.convBg ?? ""};color:${r.convFg ?? ""};`)}>
                                  {r.convStr}
                                </span>
                              </td>
                              <td style={st90}>
                                {r.revvue}
                              </td>
                            </tr>
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </React.Fragment>
              ) : null}
            </div>
          </React.Fragment>
        ) : null}
        {" "}
        {V.prospectFormOpen ? (
          <React.Fragment>
            <div onClick={V.closeProspectForm} style={st95}>
              <div onClick={V.stopProp} style={st96}>
                <div style={st97}>
                  {"Nouveau partenaire à prospecter"}
                </div>
                <div style={st98}>
                  <label style={st99}>
                    {"Nom du partenaire"}
                  </label>
                  <input value={V.prospectForm.name ?? ""} onChange={V.prospectForm.onName} placeholder="Ex. Bloom Cosmétiques" style={st100} />
                </div>
                <div style={st98}>
                  <label style={st99}>
                    {"Email de contact"}
                  </label>
                  <input value={V.prospectForm.contact ?? ""} onChange={V.prospectForm.onContact} placeholder="contact@marque.com" style={st100} />
                </div>
                <div style={st101}>
                  <button onClick={V.closeProspectForm} style={st102}>
                    {"Annuler"}
                  </button>
                  <button onClick={V.submitProspect} style={st103} className={sp("hover", "background:var(--primary-2)")}>
                    {"Ajouter"}
                  </button>
                </div>
              </div>
            </div>
          </React.Fragment>
        ) : null}
        {" "}
        {V.threadOpen ? (
          <React.Fragment>
            <div onClick={V.closeThread} style={st104}>
              <div onClick={V.stopProp} style={st105}>
                <div style={st106}>
                  <div style={st107}>
                    {V.threadInitial}
                  </div>
                  <div style={st14}>
                    <div style={st108}>
                      {V.threadName}
                    </div>
                    <div style={st66}>
                      {V.threadContact}
                    </div>
                  </div>
                  <button onClick={V.closeThread} style={st109}>
                    {"×"}
                  </button>
                </div>
                <div style={st110}>
                  {(V.threadMessages || []).map((m, _i9) => (
                    <React.Fragment key={_i9}>
                      <div style={css(`display:flex;flex-direction:column;align-items:${m.align ?? ""};`)}>
                        <div style={css(`max-width:82%;background:${m.bg ?? ""};color:${m.fg ?? ""};border-radius:${m.radius ?? ""};padding:12px 14px;box-shadow:0 1px 6px rgba(30,20,60,0.05);${m.border ?? ""}`)}>
                          <div style={st111}>
                            <span style={st112}>
                              {m.who}
                            </span>
                            {" "}
                            <span style={st113}>
                              {m.date}
                            </span>
                          </div>
                          <div style={st114}>
                            {m.subject}
                          </div>
                          <div style={st115}>
                            {m.body}
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  ))}
                  {V.threadEmpty ? (
                    <React.Fragment>
                      <div style={st116}>
                        <div style={st117}>
                          {V.mailIcon}
                        </div>
                        <div style={st118}>
                          {"Aucun échange pour l'instant — envoie le premier email ci-dessous."}
                        </div>
                      </div>
                    </React.Fragment>
                  ) : null}
                </div>
                <div style={st119}>
                  <input value={V.threadReply.subject ?? ""} onChange={V.threadReply.onSubject} placeholder="Objet" style={st120} />
                  <div style={st121}>
                    <textarea value={V.threadReply.body ?? ""} onChange={V.threadReply.onBody} placeholder="Écris ton email…" style={st122}></textarea>
                    <button onClick={V.threadReply.onSend} disabled={V.threadReply.disabled} style={css(`flex:none;display:flex;align-items:center;gap:6px;padding:10px 14px;border:none;background:var(--primary);color:#fff;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;opacity:${V.threadReply.opacity ?? ""};`)} className={sp("hover", "background:var(--primary-2)")}>
                      {V.mailSmIcon}{"Envoyer"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </React.Fragment>
        ) : null}
        {V.isIdees ? (
          <React.Fragment>
            <div style={st123}>
              <div style={css(`background:var(--card);border:2px dashed ${V.composerBorder ?? ""};border-radius:20px;padding:18px;box-shadow:0 1px 8px rgba(30,20,60,0.04);transition:border-color .15s;`)} onDragOver={V.onDragOver} onDragLeave={V.onDragLeave} onDrop={V.onDrop}>
                <textarea value={V.composerText ?? ""} onChange={V.onComposerChange} placeholder="Écris une idée, colle un lien, ou glisse une vidéo ici…" style={st124}></textarea>
                {V.aiProcessing ? (
                  <React.Fragment>
                    <div style={st125}>
                      <span style={st126}></span>
                      {" L'IA reformule ta dictée en script… "}
                    </div>
                  </React.Fragment>
                ) : null}
                <div style={st127}>
                  <div style={st128}>
                    <input type="file" accept="video/*" ref={V.fileInputRef} onChange={V.onFilePicked} style={st129} />
                    <button onClick={V.onBrowseClick} style={st130} className={sp("hover", "border-color:var(--primary);color:var(--primary-2)")}>
                      {V.clipIcon}{"Vidéo"}
                    </button>
                    {V.isRecording ? (
                      <React.Fragment>
                        <div style={st131}>
                          <span style={st132}></span>
                          {"Écoute…"}
                        </div>
                      </React.Fragment>
                    ) : null}
                    {" "}
                    {V.micError ? (
                      <React.Fragment>
                        <div style={st133}>
                          {V.micError}
                        </div>
                      </React.Fragment>
                    ) : null}
                  </div>
                  <div style={st134}>
                    {V.speechSupported ? (
                      <React.Fragment>
                        <button onClick={V.toggleDictation} style={css(`display:flex;align-items:center;gap:6px;padding:9px 13px;border:1px solid ${V.micBorder ?? ""};background:${V.micBg ?? ""};color:${V.micFg ?? ""};border-radius:11px;font-size:13px;font-weight:600;cursor:pointer;`)}>
                          {V.micIcon}{V.micLabel}
                        </button>
                      </React.Fragment>
                    ) : null}
                    <button onClick={V.addIdea} style={st135} className={sp("hover", "background:var(--primary-2)")}>
                      {V.plusIcon}{"Ajouter"}
                    </button>
                  </div>
                </div>
              </div>
              <div style={st136}>
                <div style={st137}>
                  {V.ideaCount}{" idées"}
                </div>
                <div style={st63}>
                  <button onClick={V.viewToggle.pinterest.onClick} style={css(`padding:6px 13px;border:none;border-radius:8px;cursor:pointer;font-size:12.5px;font-weight:600;background:${V.viewToggle.pinterest.bg ?? ""};color:${V.viewToggle.pinterest.fg ?? ""};`)}>
                    {"Pinterest"}
                  </button>
                  <button onClick={V.viewToggle.list.onClick} style={css(`padding:6px 13px;border:none;border-radius:8px;cursor:pointer;font-size:12.5px;font-weight:600;background:${V.viewToggle.list.bg ?? ""};color:${V.viewToggle.list.fg ?? ""};`)}>
                    {"Liste"}
                  </button>
                </div>
              </div>
              {V.isPinterestView ? (
                <React.Fragment>
                  <div style={st138}>
                    {(V.ideaCards || []).map((c, _i10) => (
                      <React.Fragment key={_i10}>
                        <div style={css(`break-inside:avoid;margin-bottom:16px;background:${c.bg ?? ""};border-radius:16px;padding:16px;position:relative;box-shadow:0 1px 6px rgba(30,20,60,0.05);`)}>
                          <div style={st139}>
                            <button onClick={c.onPin} style={css(`width:24px;height:24px;border:none;border-radius:50%;background:${c.pinBg ?? ""};color:${c.pinFg ?? ""};cursor:pointer;display:flex;align-items:center;justify-content:center;`)}>
                              {V.pinIcon}
                            </button>
                            <button onClick={c.onRemove} style={st140}>
                              {"×"}
                            </button>
                          </div>
                          {c.isText ? (
                            <React.Fragment>
                              <div style={st141}>
                                {c.text}
                              </div>
                            </React.Fragment>
                          ) : null}
                          {" "}
                          {c.isLink ? (
                            <React.Fragment>
                              <a href={c.url} target="_blank" rel="noopener" style={st142}>
                                <div style={st143}>
                                  {V.linkIcon}
                                </div>
                                <div style={st144}>
                                  {c.domain}
                                </div>
                                <div style={st145}>
                                  {c.url}
                                </div>
                              </a>
                            </React.Fragment>
                          ) : null}
                          {" "}
                          {c.isVideo ? (
                            <React.Fragment>
                              <div style={st146}>
                                <video src={c.videoUrl} controls={true} preload="metadata" style={st147}></video>
                                <div style={st148}>
                                  {c.videoName}
                                </div>
                                <div style={css(`display:inline-flex;align-self:flex-start;align-items:center;gap:5px;padding:3px 9px;border-radius:999px;font-size:11px;font-weight:700;background:${c.storeBg ?? ""};color:${c.storeFg ?? ""};`)}>
                                  {c.storeIcon}{c.storeLabel}
                                </div>
                              </div>
                            </React.Fragment>
                          ) : null}
                          <div style={st149}>
                            {c.time}
                          </div>
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                </React.Fragment>
              ) : null}
              {" "}
              {V.isListView ? (
                <React.Fragment>
                  <div style={st150}>
                    {(V.ideaCards || []).map((c, _i10) => (
                      <React.Fragment key={_i10}>
                        <div style={css(`background:${c.bg ?? ""};border-radius:16px;padding:16px;position:relative;box-shadow:0 1px 6px rgba(30,20,60,0.05);`)}>
                          <div style={st139}>
                            <button onClick={c.onPin} style={css(`width:24px;height:24px;border:none;border-radius:50%;background:${c.pinBg ?? ""};color:${c.pinFg ?? ""};cursor:pointer;display:flex;align-items:center;justify-content:center;`)}>
                              {V.pinIcon}
                            </button>
                            <button onClick={c.onRemove} style={st140}>
                              {"×"}
                            </button>
                          </div>
                          {c.isText ? (
                            <React.Fragment>
                              <div style={st151}>
                                {c.text}
                              </div>
                            </React.Fragment>
                          ) : null}
                          {" "}
                          {c.isLink ? (
                            <React.Fragment>
                              <a href={c.url} target="_blank" rel="noopener" style={st152}>
                                <div style={st153}>
                                  {V.linkIcon}
                                </div>
                                <div style={st71}>
                                  <div style={st154}>
                                    {c.domain}
                                  </div>
                                  <div style={st145}>
                                    {c.url}
                                  </div>
                                </div>
                              </a>
                            </React.Fragment>
                          ) : null}
                          {" "}
                          {c.isVideo ? (
                            <React.Fragment>
                              <div style={st155}>
                                <video src={c.videoUrl} controls={true} preload="metadata" style={st156}></video>
                                <div style={st71}>
                                  <div style={st157}>
                                    {c.videoName}
                                  </div>
                                  <div style={css(`display:inline-flex;align-items:center;gap:5px;padding:3px 9px;border-radius:999px;font-size:11px;font-weight:700;background:${c.storeBg ?? ""};color:${c.storeFg ?? ""};margin-top:6px;`)}>
                                    {c.storeIcon}{c.storeLabel}
                                  </div>
                                </div>
                              </div>
                            </React.Fragment>
                          ) : null}
                          <div style={st149}>
                            {c.time}
                          </div>
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                </React.Fragment>
              ) : null}
              {" "}
              {V.noIdeas ? (
                <React.Fragment>
                  <div style={st158}>
                    <div style={st159}>
                      {V.bulbIcon}
                    </div>
                    <div style={st160}>
                      {"Ton mur d'idées est vide — écris une idée, colle un lien ou glisse une vidéo dans la zone au-dessus."}
                    </div>
                  </div>
                </React.Fragment>
              ) : null}
            </div>
          </React.Fragment>
        ) : null}
        {V.isCommandes ? (
          <React.Fragment>
            <div style={st44}>
              <div style={st74}>
                {(V.ordersKpis || []).map((k, _i8) => (
                  <React.Fragment key={_i8}>
                    <div style={st49}>
                      <div style={st161}>
                        {k.label}
                      </div>
                      <div style={st162}>
                        {k.value}
                      </div>
                    </div>
                  </React.Fragment>
                ))}
              </div>
              <div style={st84}>
                <table style={st85}>
                  <thead>
                    <tr style={st86}>
                      <th style={st87} onClick={V.cmdSort.dateKey.onClick}>
                        <span style={css(`color:${V.cmdSort.dateKey.color ?? ""}`)}>
                          {"Date"}{V.cmdSort.dateKey.arrow}
                        </span>
                      </th>
                      <th style={st87} onClick={V.cmdSort.produit.onClick}>
                        <span style={css(`color:${V.cmdSort.produit.color ?? ""}`)}>
                          {"Produit"}{V.cmdSort.produit.arrow}
                        </span>
                      </th>
                      <th style={st87} onClick={V.cmdSort.vendeur.onClick}>
                        <span style={css(`color:${V.cmdSort.vendeur.color ?? ""}`)}>
                          {"Vendeur"}{V.cmdSort.vendeur.arrow}
                        </span>
                      </th>
                      <th style={st87} onClick={V.cmdSort.statut.onClick}>
                        <span style={css(`color:${V.cmdSort.statut.color ?? ""}`)}>
                          {"Statut"}{V.cmdSort.statut.arrow}
                        </span>
                      </th>
                      <th style={st88} onClick={V.cmdSort.gmv.onClick}>
                        <span style={css(`color:${V.cmdSort.gmv.color ?? ""}`)}>
                          {"GMV"}{V.cmdSort.gmv.arrow}
                        </span>
                      </th>
                      <th style={st88} onClick={V.cmdSort.com.onClick}>
                        <span style={css(`color:${V.cmdSort.com.color ?? ""}`)}>
                          {"Commission"}{V.cmdSort.com.arrow}
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {(V.commandesRows || []).map((r, _i10) => (
                      <React.Fragment key={_i10}>
                        <tr style={st86} className={sp("hover", "background:var(--primary-softer)")}>
                          <td style={st163}>
                            {r.date}
                          </td>
                          <td style={st89}>
                            {r.produit}
                          </td>
                          <td style={st94}>
                            {r.vendeur}
                          </td>
                          <td style={st164}>
                            <span style={css(`display:inline-block;padding:4px 10px;border-radius:999px;font-size:11.5px;font-weight:700;background:${r.statutBg ?? ""};color:${r.statutFg ?? ""};`)}>
                              {r.statut}
                            </span>
                          </td>
                          <td style={st91}>
                            {r.gmv}
                          </td>
                          <td style={st92}>
                            {r.com}
                          </td>
                        </tr>
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
                {V.noCommandes ? (
                  <React.Fragment>
                    <div style={st165}>
                      {"Aucune commande ne correspond à ces filtres."}
                    </div>
                  </React.Fragment>
                ) : null}
              </div>
            </div>
          </React.Fragment>
        ) : null}
        {V.isParametres ? (
          <React.Fragment>
            <div style={st166}>
              <div style={st167}>
                <div style={st57}>
                  {"Profil"}
                </div>
                <div style={st168}>
                  {V.hasAvatar ? (
                    <React.Fragment>
                      {" "}{V.avatarImg}{" "}
                    </React.Fragment>
                  ) : null}
                  {" "}
                  {V.noAvatar ? (
                    <React.Fragment>
                      <div style={st169}>
                        {V.avatarInitials}
                      </div>
                    </React.Fragment>
                  ) : null}
                  <div style={st170}>
                    <div style={st171}>
                      {"JPG ou PNG, 400×400 px minimum."}
                    </div>
                    <div style={st134}>
                      <input type="file" accept="image/*" ref={V.avatarInputRef} onChange={V.onAvatarPick} style={st129} />
                      <button onClick={V.onAvatarBrowse} style={st172} className={sp("hover", "background:var(--primary-2)")}>
                        {"Changer la photo"}
                      </button>
                      {V.hasAvatar ? (
                        <React.Fragment>
                          <button onClick={V.onAvatarRemove} style={st173} className={sp("hover", "border-color:var(--neg);color:var(--neg)")}>
                            {"Retirer"}
                          </button>
                        </React.Fragment>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div style={st174}>
                  <div style={st175}>
                    <label style={st176}>
                      {"Nom complet"}
                    </label>
                    <input value={V.profileName ?? ""} onChange={V.onProfileName} style={st177} />
                  </div>
                  <div style={st175}>
                    <label style={st176}>
                      {"Pseudo TikTok"}
                    </label>
                    <input value={V.profileHandle ?? ""} onChange={V.onProfileHandle} style={st177} />
                  </div>
                  <div style={st175}>
                    <label style={st176}>
                      {"Email"}
                    </label>
                    <input type="email" value={V.profileEmail ?? ""} onChange={V.onProfileEmail} style={st177} />
                  </div>
                  <div style={st175}>
                    <label style={st176}>
                      {"Téléphone"}
                    </label>
                    <input value={V.profilePhone ?? ""} onChange={V.onProfilePhone} style={st177} />
                  </div>
                </div>
                <div style={st178}>
                  <button onClick={V.saveProfile} style={st179} className={sp("hover", "background:var(--primary-2)")}>
                    {"Enregistrer"}
                  </button>
                  {V.profileSaved ? (
                    <React.Fragment>
                      <div style={st180}>
                        {"Modifications enregistrées."}
                      </div>
                    </React.Fragment>
                  ) : null}
                </div>
              </div>
              <div style={st181}>
                <div>
                  <div style={st57}>
                    {"Mot de passe"}
                  </div>
                  <div style={st182}>
                    {"8 caractères minimum, avec une majuscule et un chiffre."}
                  </div>
                </div>
                <div style={st174}>
                  <div style={st183}>
                    <label style={st176}>
                      {"Mot de passe actuel"}
                    </label>
                    <input type="password" value={V.pwdCurrent ?? ""} onChange={V.onPwdCurrent} placeholder="••••••••" style={st184} />
                  </div>
                  <div style={st175}>
                    <label style={st176}>
                      {"Nouveau mot de passe"}
                    </label>
                    <input type="password" value={V.pwdNext ?? ""} onChange={V.onPwdNext} placeholder="••••••••" style={st184} />
                  </div>
                  <div style={st175}>
                    <label style={st176}>
                      {"Confirmation"}
                    </label>
                    <input type="password" value={V.pwdConfirm ?? ""} onChange={V.onPwdConfirm} placeholder="••••••••" style={st184} />
                  </div>
                </div>
                {V.showPwdMeter ? (
                  <React.Fragment>
                    <div style={st185}>
                      <div style={st186}>
                        <div style={css(`height:100%;border-radius:999px;width:${V.pwdBarWidth ?? ""};background:${V.pwdBarColor ?? ""};transition:width .18s ease;`)}></div>
                      </div>
                      <div style={css(`font-size:12px;font-weight:700;color:${V.pwdBarColor ?? ""};min-width:64px;`)}>
                        {V.pwdLevel}
                      </div>
                    </div>
                  </React.Fragment>
                ) : null}
                <div style={st178}>
                  <button onClick={V.submitPwd} style={st179} className={sp("hover", "background:var(--primary-2)")}>
                    {"Mettre à jour"}
                  </button>
                  {V.pwdMsg ? (
                    <React.Fragment>
                      <div style={css(`font-size:13px;font-weight:600;color:${V.pwdMsgColor ?? ""};`)}>
                        {V.pwdMsg}
                      </div>
                    </React.Fragment>
                  ) : null}
                </div>
              </div>
              <div style={st187}>
                <div style={st188}>
                  <div style={st189}>
                    {"Notifications"}
                  </div>
                  <span style={st190}>
                    {"En développement"}
                  </span>
                </div>
                {(V.notifRows || []).map((n, _i8) => (
                  <React.Fragment key={_i8}>
                    <div style={st191}>
                      <div>
                        <div style={st192}>
                          {n.label}
                        </div>
                        <div style={st193}>
                          {n.sub}
                        </div>
                      </div>
                      <div style={st194}>
                        <span style={st195}></span>
                      </div>
                    </div>
                  </React.Fragment>
                ))}
              </div>
              <div style={st196}>
                <div>
                  <div style={st57}>
                    {"Connexion TikTok Shop"}
                  </div>
                  <div style={st182}>
                    {"Synchronise tes commandes, produits et commissions automatiquement."}
                  </div>
                </div>
                {V.tiktokConnected ? (
                  <React.Fragment>
                    <div style={st197}>
                      {"Connecté"}
                    </div>
                  </React.Fragment>
                ) : null}
                {" "}
                {V.tiktokOff ? (
                  <React.Fragment>
                    <button style={st198} className={sp("hover", "background:var(--primary-2)")}>
                      {"Connecter"}
                    </button>
                  </React.Fragment>
                ) : null}
              </div>
              <div style={st199}>
                <div>
                  <div style={st200}>
                    {"Supprimer le compte"}
                  </div>
                  <div style={st201}>
                    {"Toutes tes données, idées et historiques de prospection seront effacés."}
                  </div>
                </div>
                <button style={st202} className={sp("hover", "background:var(--neg);color:#fff")}>
                  {"Supprimer"}
                </button>
              </div>
            </div>
          </React.Fragment>
        ) : null}
        {V.isVideosPage ? (
          <React.Fragment>
            <div style={st203}>
              <div style={st204}>
                <div style={st205}>
                  <button onClick={V.vidGoRoot} style={css(`border:none;background:transparent;padding:4px 6px;border-radius:8px;font-family:inherit;font-size:13.5px;font-weight:700;color:${V.vidRootFg ?? ""};cursor:pointer;`)} className={sp("hover", "background:var(--primary-softer)")}>
                    {"Toutes les vidéos"}
                  </button>
                  {V.vidInFolder ? (
                    <React.Fragment>
                      <span style={st24}>
                        {V.chevronRIcon}
                      </span>
                      {" "}
                      <span style={st206}>
                        {V.vidFolderName}
                      </span>
                    </React.Fragment>
                  ) : null}
                </div>
                <div style={st10}></div>
                <input value={V.vidQuery ?? ""} onChange={V.onVidQuery} placeholder="Rechercher une vidéo…" style={st207} />
                <button onClick={V.vidNewFolder} style={st208} className={sp("hover", "background:var(--primary-softer)")}>
                  {V.folderPlusIcon}
                  <span>
                    {"Nouveau dossier"}
                  </span>
                </button>
                <input type="file" accept="video/*" multiple="" ref={V.vidInputRef} onChange={V.onVidPick} style={st129} />
                <button onClick={V.vidBrowse} style={st209}>
                  {V.uploadIcon}
                  <span>
                    {"Importer"}
                  </span>
                </button>
                <div style={st210}>
                  <button onClick={V.vidGridBtn.onClick} style={css(`padding:7px 10px;border:none;border-radius:9px;background:${V.vidGridBtn.bg ?? ""};color:${V.vidGridBtn.fg ?? ""};cursor:pointer;display:flex;`)}>
                    {V.gridIcon}
                  </button>
                  <button onClick={V.vidListBtn.onClick} style={css(`padding:7px 10px;border:none;border-radius:9px;background:${V.vidListBtn.bg ?? ""};color:${V.vidListBtn.fg ?? ""};cursor:pointer;display:flex;`)}>
                    {V.listIcon}
                  </button>
                </div>
              </div>
              <div style={st211}>
                {(V.vidFilters || []).map((f, _i8) => (
                  <React.Fragment key={_i8}>
                    <button onClick={f.onClick} style={css(`display:flex;align-items:center;gap:7px;padding:7px 13px;border:1px solid ${f.border ?? ""};border-radius:999px;background:${f.bg ?? ""};color:${f.fg ?? ""};font-size:12.5px;font-weight:600;font-family:inherit;cursor:pointer;`)}>
                      <span>
                        {f.label}
                      </span>
                      {" "}
                      <span style={st212}>
                        {f.count}
                      </span>
                    </button>
                  </React.Fragment>
                ))}
              </div>
              <div onDragOver={V.onVidDragOver} onDragLeave={V.onVidDragLeave} onDrop={V.onVidDrop} style={css(`border:2px dashed ${V.vidDropBorder ?? ""};background:${V.vidDropBg ?? ""};border-radius:20px;padding:18px;transition:background .15s,border-color .15s;min-height:340px;`)}>
                {V.vidIsGrid ? (
                  <React.Fragment>
                    <div style={st213}>
                      {(V.vidCards || []).map((r, _i11) => (
                        <React.Fragment key={_i11}>
                          <div draggable={r.draggable} onDragStart={r.onDragStart} onDragOver={r.onDragOver} onDragLeave={r.onDragLeave} onDrop={r.onDrop} onDoubleClick={r.onOpen} style={css(`position:relative;background:var(--card);border:1.5px solid ${r.border ?? ""};border-radius:16px;padding:12px;display:flex;flex-direction:column;gap:10px;cursor:pointer;box-shadow:0 1px 8px rgba(30,20,60,0.04);transition:border-color .15s,transform .12s;`)} className={sp("hover", "transform:translateY(-2px)")}>
                            <div onClick={r.onOpen} style={css(`height:112px;border-radius:11px;overflow:hidden;background:${r.thumbBg ?? ""};display:flex;align-items:center;justify-content:center;color:${r.thumbFg ?? ""};`)}>
                              {" "}{r.thumb}{" "}
                            </div>
                            <div>
                              <div style={st214}>
                                {r.name}
                              </div>
                              <div style={st215}>
                                {r.meta}
                              </div>
                            </div>
                            {r.isFile ? (
                              <React.Fragment>
                                <div style={st21}>
                                  <button onClick={r.onStatusClick} style={css(`width:100%;display:flex;align-items:center;justify-content:space-between;gap:6px;padding:6px 11px;border:none;border-radius:999px;background:${r.stBg ?? ""};color:${r.stFg ?? ""};font-size:11.5px;font-weight:700;font-family:inherit;cursor:pointer;`)}>
                                    <span>
                                      {r.status}
                                    </span>
                                    {" "}
                                    <span style={st216}>
                                      {V.chevronMiniIcon}
                                    </span>
                                  </button>
                                  {r.menuOpen ? (
                                    <React.Fragment>
                                      <div onClick={r.closeMenu} style={st25}></div>
                                      <div onClick={V.stopProp} style={st217}>
                                        {(r.statusOptions || []).map((o, _i20) => (
                                          <React.Fragment key={_i20}>
                                            <button onClick={o.onClick} style={css(`display:flex;align-items:center;gap:8px;padding:8px 10px;border:none;border-radius:9px;background:${o.bg ?? ""};color:var(--text);font-size:12.5px;font-weight:600;font-family:inherit;text-align:left;cursor:pointer;`)} className={sp("hover", "background:var(--primary-softer)")}>
                                              <span style={css(`width:8px;height:8px;border-radius:50%;background:${o.dot ?? ""};flex:none;`)}></span>
                                              {" "}
                                              <span style={st10}>
                                                {o.label}
                                              </span>
                                            </button>
                                          </React.Fragment>
                                        ))}
                                      </div>
                                    </React.Fragment>
                                  ) : null}
                                </div>
                              </React.Fragment>
                            ) : null}
                            <div style={st218}>
                              <button onClick={r.onRename} title="Renommer" style={st219} className={sp("hover", "background:var(--primary-softer)")}>
                                {V.penIcon}
                              </button>
                              <button onClick={r.onDelete} title="Supprimer" style={st220} className={sp("hover", "background:var(--neg-soft);color:var(--neg)")}>
                                {V.trashIcon2}
                              </button>
                            </div>
                          </div>
                        </React.Fragment>
                      ))}
                    </div>
                  </React.Fragment>
                ) : null}
                {" "}
                {V.vidIsList ? (
                  <React.Fragment>
                    <div style={st221}>
                      {(V.vidCards || []).map((r, _i11) => (
                        <React.Fragment key={_i11}>
                          <div draggable={r.draggable} onDragStart={r.onDragStart} onDragOver={r.onDragOver} onDragLeave={r.onDragLeave} onDrop={r.onDrop} onDoubleClick={r.onOpen} style={css(`display:flex;align-items:center;gap:14px;padding:11px 15px;border-bottom:1px solid var(--border);border-left:3px solid ${r.rowAccent ?? ""};cursor:pointer;`)} className={sp("hover", "background:var(--primary-softer)")}>
                            <div onClick={r.onOpen} style={css(`width:34px;height:34px;flex:none;border-radius:10px;background:${r.thumbBg ?? ""};color:${r.thumbFg ?? ""};display:flex;align-items:center;justify-content:center;`)}>
                              {r.smallIcon}
                            </div>
                            <div style={st14}>
                              <div style={st65}>
                                {r.name}
                              </div>
                            </div>
                            {r.isFile ? (
                              <React.Fragment>
                                <button onClick={r.onStatusCycle} style={css(`padding:5px 11px;border:none;border-radius:999px;background:${r.stBg ?? ""};color:${r.stFg ?? ""};font-size:11.5px;font-weight:700;font-family:inherit;cursor:pointer;flex:none;`)}>
                                  {r.status}
                                </button>
                              </React.Fragment>
                            ) : null}
                            <div style={st222}>
                              {r.meta}
                            </div>
                            <button onClick={r.onRename} style={st223}>
                              {V.penIcon}
                            </button>
                            <button onClick={r.onDelete} style={st224} className={sp("hover", "background:var(--neg-soft);color:var(--neg)")}>
                              {V.trashIcon2}
                            </button>
                          </div>
                        </React.Fragment>
                      ))}
                    </div>
                  </React.Fragment>
                ) : null}
                {" "}
                {V.vidEmpty ? (
                  <React.Fragment>
                    <div style={st225}>
                      <div style={st226}>
                        {V.videoBigIcon}
                      </div>
                      <div style={st227}>
                        {V.vidEmptyTitle}
                      </div>
                      <div style={st228}>
                        {V.vidEmptySub}
                      </div>
                    </div>
                  </React.Fragment>
                ) : null}
              </div>
              <div style={st229}>
                {"Astuce : clique le badge de statut pour le changer · glisse une vidéo sur un dossier pour la ranger."}
              </div>
            </div>
            {V.vidRenameOpen ? (
              <React.Fragment>
                <div onClick={V.vidRenameClose} style={st95}>
                  <div onClick={V.stopProp} style={st230}>
                    <div style={st97}>
                      {"Renommer"}
                    </div>
                    <input value={V.vidRenameVal ?? ""} onChange={V.onVidRenameVal} onKeyDown={V.onVidRenameKey} style={st231} />
                    <div style={st232}>
                      <button onClick={V.vidRenameClose} style={st173}>
                        {"Annuler"}
                      </button>
                      <button onClick={V.vidRenameSave} style={st172}>
                        {"Enregistrer"}
                      </button>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            ) : null}
            {" "}
            {V.vidPreviewOpen ? (
              <React.Fragment>
                <div onClick={V.vidPreviewClose} style={st233}>
                  <div onClick={V.stopProp} style={st234}>
                    <div style={st235}>
                      {V.vidPreviewMedia}
                    </div>
                    <div style={st236}>
                      <div style={st237}>
                        <div style={st238}>
                          {V.vidPreviewName}
                        </div>
                        <div style={st239}>
                          {V.vidPreviewMeta}
                        </div>
                      </div>
                      {(V.vidPreviewStatuses || []).map((o, _i11) => (
                        <React.Fragment key={_i11}>
                          <button onClick={o.onClick} style={css(`padding:7px 12px;border:1px solid ${o.border ?? ""};border-radius:999px;background:${o.bg ?? ""};color:${o.fg ?? ""};font-size:12px;font-weight:700;font-family:inherit;cursor:pointer;`)}>
                            {o.label}
                          </button>
                        </React.Fragment>
                      ))}
                      <button onClick={V.vidPreviewClose} style={st240}>
                        {"Fermer"}
                      </button>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            ) : null}
          </React.Fragment>
        ) : null}
        {V.isRushs ? (
          <React.Fragment>
            <div style={st203}>
              <div style={st204}>
                <div style={st205}>
                  <button onClick={V.rushGoRoot} style={css(`border:none;background:transparent;padding:4px 6px;border-radius:8px;font-family:inherit;font-size:13.5px;font-weight:700;color:${V.rushRootFg ?? ""};cursor:pointer;`)} className={sp("hover", "background:var(--primary-softer)")}>
                    {"Tous les rushs"}
                  </button>
                  {V.rushInFolder ? (
                    <React.Fragment>
                      <span style={st24}>
                        {V.chevronRIcon}
                      </span>
                      {" "}
                      <span style={st206}>
                        {V.rushFolderName}
                      </span>
                    </React.Fragment>
                  ) : null}
                </div>
                <div style={st10}></div>
                <input value={V.rushQuery ?? ""} onChange={V.onRushQuery} placeholder="Rechercher un rush…" style={st241} />
                <button onClick={V.rushNewFolder} style={st208} className={sp("hover", "background:var(--primary-softer)")}>
                  {V.folderPlusIcon}
                  <span>
                    {"Nouveau dossier"}
                  </span>
                </button>
                <input type="file" accept="video/*" multiple="" ref={V.rushInputRef} onChange={V.onRushPick} style={st129} />
                <button onClick={V.rushBrowse} style={st209}>
                  {V.uploadIcon}
                  <span>
                    {"Importer"}
                  </span>
                </button>
                <div style={st210}>
                  <button onClick={V.rushGridBtn.onClick} style={css(`padding:7px 10px;border:none;border-radius:9px;background:${V.rushGridBtn.bg ?? ""};color:${V.rushGridBtn.fg ?? ""};cursor:pointer;display:flex;`)}>
                    {V.gridIcon}
                  </button>
                  <button onClick={V.rushListBtn.onClick} style={css(`padding:7px 10px;border:none;border-radius:9px;background:${V.rushListBtn.bg ?? ""};color:${V.rushListBtn.fg ?? ""};cursor:pointer;display:flex;`)}>
                    {V.listIcon}
                  </button>
                </div>
              </div>
              <div onDragOver={V.onRushDragOver} onDragLeave={V.onRushDragLeave} onDrop={V.onRushDrop} style={css(`border:2px dashed ${V.rushDropBorder ?? ""};background:${V.rushDropBg ?? ""};border-radius:20px;padding:18px;transition:background .15s,border-color .15s;min-height:340px;`)}>
                {V.rushIsGrid ? (
                  <React.Fragment>
                    <div style={st242}>
                      {(V.rushCards || []).map((r, _i11) => (
                        <React.Fragment key={_i11}>
                          <div draggable={r.draggable} onDragStart={r.onDragStart} onDragOver={r.onDragOver} onDragLeave={r.onDragLeave} onDrop={r.onDrop} onDoubleClick={r.onOpen} style={css(`position:relative;background:var(--card);border:1.5px solid ${r.border ?? ""};border-radius:16px;padding:12px;display:flex;flex-direction:column;gap:10px;cursor:pointer;box-shadow:0 1px 8px rgba(30,20,60,0.04);transition:border-color .15s,transform .12s;`)} className={sp("hover", "transform:translateY(-2px)")}>
                            <div onClick={r.onOpen} style={css(`height:112px;border-radius:11px;overflow:hidden;background:${r.thumbBg ?? ""};display:flex;align-items:center;justify-content:center;color:${r.thumbFg ?? ""};`)}>
                              {" "}{r.thumb}{" "}
                            </div>
                            <div>
                              <div style={st214}>
                                {r.name}
                              </div>
                              <div style={st215}>
                                {r.meta}
                              </div>
                            </div>
                            <div style={st218}>
                              <button onClick={r.onRename} title="Renommer" style={st219} className={sp("hover", "background:var(--primary-softer)")}>
                                {V.penIcon}
                              </button>
                              <button onClick={r.onDelete} title="Supprimer" style={st220} className={sp("hover", "background:var(--neg-soft);color:var(--neg)")}>
                                {V.trashIcon2}
                              </button>
                            </div>
                          </div>
                        </React.Fragment>
                      ))}
                    </div>
                  </React.Fragment>
                ) : null}
                {" "}
                {V.rushIsList ? (
                  <React.Fragment>
                    <div style={st221}>
                      {(V.rushCards || []).map((r, _i11) => (
                        <React.Fragment key={_i11}>
                          <div draggable={r.draggable} onDragStart={r.onDragStart} onDragOver={r.onDragOver} onDragLeave={r.onDragLeave} onDrop={r.onDrop} onDoubleClick={r.onOpen} style={css(`display:flex;align-items:center;gap:14px;padding:11px 15px;border-bottom:1px solid var(--border);border-left:3px solid ${r.rowAccent ?? ""};cursor:pointer;`)} className={sp("hover", "background:var(--primary-softer)")}>
                            <div onClick={r.onOpen} style={css(`width:34px;height:34px;flex:none;border-radius:10px;background:${r.thumbBg ?? ""};color:${r.thumbFg ?? ""};display:flex;align-items:center;justify-content:center;`)}>
                              {r.smallIcon}
                            </div>
                            <div style={st14}>
                              <div style={st65}>
                                {r.name}
                              </div>
                            </div>
                            <div style={st243}>
                              {r.meta}
                            </div>
                            <button onClick={r.onRename} style={st223}>
                              {V.penIcon}
                            </button>
                            <button onClick={r.onDelete} style={st224} className={sp("hover", "background:var(--neg-soft);color:var(--neg)")}>
                              {V.trashIcon2}
                            </button>
                          </div>
                        </React.Fragment>
                      ))}
                    </div>
                  </React.Fragment>
                ) : null}
                {" "}
                {V.rushEmpty ? (
                  <React.Fragment>
                    <div style={st225}>
                      <div style={st226}>
                        {V.uploadBigIcon}
                      </div>
                      <div style={st227}>
                        {"Glisse tes rushs ici"}
                      </div>
                      <div style={st228}>
                        {"MP4, MOV, AVI, MKV, WebM — tous formats acceptés. Crée des dossiers pour trier par produit ou par marque."}
                      </div>
                    </div>
                  </React.Fragment>
                ) : null}
              </div>
              <div style={st229}>
                {"Astuce : glisse un rush sur un dossier pour le ranger. Double-clic pour ouvrir."}
              </div>
            </div>
            {V.rushRenameOpen ? (
              <React.Fragment>
                <div onClick={V.rushRenameClose} style={st95}>
                  <div onClick={V.stopProp} style={st230}>
                    <div style={st97}>
                      {"Renommer"}
                    </div>
                    <input value={V.rushRenameVal ?? ""} onChange={V.onRushRenameVal} onKeyDown={V.onRushRenameKey} style={st231} />
                    <div style={st232}>
                      <button onClick={V.rushRenameClose} style={st173}>
                        {"Annuler"}
                      </button>
                      <button onClick={V.rushRenameSave} style={st172}>
                        {"Enregistrer"}
                      </button>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            ) : null}
            {" "}
            {V.rushPreviewOpen ? (
              <React.Fragment>
                <div onClick={V.rushPreviewClose} style={st233}>
                  <div onClick={V.stopProp} style={st234}>
                    <div style={st235}>
                      {V.rushPreviewMedia}
                    </div>
                    <div style={st244}>
                      <div style={st14}>
                        <div style={st238}>
                          {V.rushPreviewName}
                        </div>
                        <div style={st239}>
                          {V.rushPreviewMeta}
                        </div>
                      </div>
                      <button onClick={V.rushPreviewRename} style={st245}>
                        {"Renommer"}
                      </button>
                      <button onClick={V.rushPreviewClose} style={st240}>
                        {"Fermer"}
                      </button>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            ) : null}
          </React.Fragment>
        ) : null}
        {V.isAssistant ? (
          <React.Fragment>
            <div style={st246}>
              <div style={st211}>
                <div style={st247}>
                  <span style={st248}></span>
                  {"Données connectées "}
                </div>
                {(V.ctxChips || []).map((c, _i8) => (
                  <React.Fragment key={_i8}>
                    <div style={st249}>
                      {c.label}
                    </div>
                  </React.Fragment>
                ))}
                <div style={st10}></div>
                {V.hasChat ? (
                  <React.Fragment>
                    <button onClick={V.resetChat} style={st250}>
                      {"Nouvelle conversation"}
                    </button>
                  </React.Fragment>
                ) : null}
              </div>
              <div ref={V.chatScrollRef} style={st251}>
                {V.chatEmpty ? (
                  <React.Fragment>
                    <div style={st252}>
                      <div style={st155}>
                        <div style={st253}>
                          {V.sparkIcon}
                        </div>
                        <div>
                          <div style={st254}>
                            {"Ton conseiller data"}
                          </div>
                          <div style={st255}>
                            {"Il lit tes commandes, marques, produits et vidéos, puis te dit quoi pousser."}
                          </div>
                        </div>
                      </div>
                      <div style={st256}>
                        {(V.suggestions || []).map((s, _i12) => (
                          <React.Fragment key={_i12}>
                            <button onClick={s.onClick} style={st257} className={sp("hover", "background:var(--primary-softer);border-color:var(--primary)")}>
                              {s.label}
                            </button>
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  </React.Fragment>
                ) : null}
                {(V.chatMsgs || []).map((m, _i8) => (
                  <React.Fragment key={_i8}>
                    <div style={css(`display:flex;justify-content:${m.justify ?? ""};`)}>
                      <div style={st258}>
                        <div style={css(`font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:var(--text-3);text-align:${m.align ?? ""};`)}>
                          {m.who}
                        </div>
                        <div style={css(`background:${m.bg ?? ""};color:${m.fg ?? ""};border:1px solid ${m.border ?? ""};border-radius:16px;padding:13px 16px;font-size:14px;line-height:1.6;white-space:pre-wrap;text-wrap:pretty;`)}>
                          {m.text}
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                ))}
                {V.chatBusy ? (
                  <React.Fragment>
                    <div style={st259}>
                      <span style={st126}></span>
                      {"L'assistant analyse ta data… "}
                    </div>
                  </React.Fragment>
                ) : null}
                {" "}
                {V.chatErr ? (
                  <React.Fragment>
                    <div style={st260}>
                      {V.chatErr}
                    </div>
                  </React.Fragment>
                ) : null}
              </div>
              <div style={st261}>
                <textarea value={V.chatInput ?? ""} onChange={V.onChatInput} onKeyDown={V.onChatKey} placeholder="Demande-lui : sur quelle marque appuyer aujourd'hui ?" style={st262}></textarea>
                <div style={st263}>
                  <div style={st264}>
                    {"Entrée pour envoyer · Maj+Entrée pour une nouvelle ligne"}
                  </div>
                  <button onClick={V.sendChat} style={css(`display:flex;align-items:center;gap:7px;padding:10px 16px;border:none;border-radius:12px;background:${V.sendBg ?? ""};color:#fff;font-size:13.5px;font-weight:600;font-family:inherit;cursor:${V.sendCursor ?? ""};`)}>
                    {V.sendIcon}
                    <span>
                      {"Demander"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </React.Fragment>
        ) : null}
        {V.isOther ? (
          <React.Fragment>
            <div style={st265}>
              <div style={st266}>
                {V.otherIcon}
              </div>
              <div style={st267}>
                {V.pageTitle}
              </div>
              <div style={st268}>
                {"Cette section n'est pas incluse dans cette maquette — le focus est sur le "}
                <strong style={st269}>
                  {"Dashboard"}
                </strong>
                {" et "}
                <strong style={st269}>
                  {"Analytics"}
                </strong>
                {"."}
              </div>
            </div>
          </React.Fragment>
        ) : null}
      </main>
    </div>
  );
}
