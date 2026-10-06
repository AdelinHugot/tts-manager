// ⚠️  FICHIER GÉNÉRÉ — ne pas éditer à la main.
// Source : design/TTS Manager.dc.html  ·  Générateur : tools/dc-to-jsx.mjs
// Régénérer avec : npm run gen:view
import React from 'react';
import { css, sp } from './lib/style.js';

const st0 = {"display":"flex","height":"100vh","background":"var(--bg)","color":"var(--text)","fontFamily":"'Inter',system-ui,sans-serif"};
const st1 = {"width":"248px","flex":"none","background":"var(--sidebar)","borderRight":"1px solid var(--border)","display":"flex","flexDirection":"column","padding":"22px 16px","height":"100vh"};
const st2 = {"display":"flex","alignItems":"center","gap":"11px","padding":"4px 8px 22px"};
const st3 = {"width":"36px","height":"36px","borderRadius":"11px","background":"var(--primary)","display":"flex","alignItems":"center","justifyContent":"center","color":"#fff","boxShadow":"0 4px 12px rgba(124,111,247,0.32)"};
const st4 = {"flex":"none"};
const st5 = {"fontWeight":"700","fontSize":"15px","letterSpacing":"-0.02em"};
const st6 = {"fontSize":"11px","color":"var(--text-3)","fontWeight":"500","marginTop":"1px"};
const st7 = {"display":"flex","flexDirection":"column","gap":"18px"};
const st8 = {"display":"flex","flexDirection":"column","gap":"2px"};
const st9 = {"fontSize":"10.5px","fontWeight":"700","textTransform":"uppercase","letterSpacing":"0.08em","color":"var(--text-3)","padding":"0 12px 6px"};
const st10 = {"display":"flex","width":"20px","height":"20px","alignItems":"center","justifyContent":"center","flex":"none"};
const st11 = {"flex":"1"};
const st12 = {"fontSize":"10.5px","fontWeight":"700","background":"var(--primary)","color":"#fff","padding":"1px 7px","borderRadius":"999px"};
const st13 = {"display":"flex","alignItems":"center","gap":"10px","padding":"9px","borderRadius":"13px","background":"var(--primary-softer)","border":"1px solid var(--border)"};
const st14 = {"width":"34px","height":"34px","flex":"none","borderRadius":"50%","objectFit":"cover"};
const st15 = {"width":"34px","height":"34px","flex":"none","borderRadius":"50%","background":"linear-gradient(135deg,var(--primary),var(--secondary))","color":"#fff","display":"flex","alignItems":"center","justifyContent":"center","fontWeight":"700","fontSize":"12.5px"};
const st16 = {"flex":"1","minWidth":"0"};
const st17 = {"fontSize":"13px","fontWeight":"600","whiteSpace":"nowrap","overflow":"hidden","textOverflow":"ellipsis"};
const st18 = {"fontSize":"11px","color":"var(--text-3)","whiteSpace":"nowrap","overflow":"hidden","textOverflow":"ellipsis"};
const st19 = {"display":"flex","alignItems":"center","gap":"12px","width":"100%","marginTop":"8px","padding":"10px 12px","border":"1px solid var(--border)","borderRadius":"13px","cursor":"pointer","fontSize":"13.5px","fontWeight":"600","textAlign":"left","background":"transparent","color":"var(--text-2)","transition":"background .15s,color .15s,border-color .15s"};
const st20 = {"flex":"1","minWidth":"0","display":"flex","flexDirection":"column","height":"100vh","overflowY":"auto"};
const st21 = {"position":"sticky","top":"0","zIndex":"20","background":"rgba(246,244,253,0.82)","backdropFilter":"blur(12px)","WebkitBackdropFilter":"blur(12px)","borderBottom":"1px solid var(--border)","padding":"18px 32px","display":"flex","alignItems":"center","justifyContent":"space-between","gap":"16px"};
const st22 = {"fontSize":"21px","fontWeight":"700","letterSpacing":"-0.02em"};
const st23 = {"fontSize":"13px","color":"var(--text-3)","marginTop":"2px"};
const st24 = {"position":"relative"};
const st25 = {"display":"flex","alignItems":"center","gap":"9px","padding":"9px 14px","border":"1px solid var(--border-2)","background":"var(--card)","borderRadius":"12px","cursor":"pointer","fontSize":"13.5px","fontWeight":"600","color":"var(--text)","boxShadow":"0 1px 2px rgba(30,20,60,0.04)"};
const st26 = {"color":"var(--primary)","display":"flex"};
const st27 = {"color":"var(--text-3)","display":"flex"};
const st28 = {"position":"fixed","inset":"0","zIndex":"30"};
const st29 = {"position":"absolute","right":"0","top":"50px","zIndex":"31","display":"flex","background":"var(--card)","border":"1px solid var(--border)","borderRadius":"20px","boxShadow":"0 20px 50px rgba(40,28,90,0.18)","overflow":"hidden","animation":"fadeIn .14s ease"};
const st30 = {"width":"190px","flex":"none","background":"var(--primary-softer)","borderRight":"1px solid var(--border)","padding":"16px 12px","display":"flex","flexDirection":"column","gap":"2px"};
const st31 = {"fontSize":"10.5px","fontWeight":"700","textTransform":"uppercase","letterSpacing":"0.09em","color":"var(--text-3)","padding":"2px 8px 10px"};
const st32 = {"padding":"16px 18px 14px","width":"330px"};
const st33 = {"display":"flex","alignItems":"center","justifyContent":"space-between","marginBottom":"12px"};
const st34 = {"width":"28px","height":"28px","border":"1px solid var(--border-2)","background":"var(--card)","borderRadius":"9px","cursor":"pointer","color":"var(--text-2)","display":"flex","alignItems":"center","justifyContent":"center","fontSize":"15px","lineHeight":"1","fontFamily":"inherit"};
const st35 = {"fontSize":"13.5px","fontWeight":"700","letterSpacing":"0.03em","textTransform":"uppercase"};
const st36 = {"display":"grid","gridTemplateColumns":"repeat(7,1fr)","marginBottom":"4px"};
const st37 = {"textAlign":"center","fontSize":"10.5px","fontWeight":"700","color":"var(--text-3)","letterSpacing":"0.05em","padding":"4px 0"};
const st38 = {"display":"grid","gridTemplateColumns":"repeat(7,1fr)"};
const st39 = {"display":"flex","alignItems":"center","justifyContent":"space-between","gap":"12px","borderTop":"1px solid var(--border)","marginTop":"12px","paddingTop":"12px"};
const st40 = {"fontSize":"12px","fontWeight":"600","color":"var(--text-3)"};
const st41 = {"display":"flex","alignItems":"center","gap":"8px","flexWrap":"wrap","justifyContent":"flex-end"};
const st42 = {"appearance":"none","padding":"9px 14px","border":"1px solid var(--border-2)","background":"var(--card)","borderRadius":"12px","cursor":"pointer","fontSize":"13.5px","fontWeight":"600","fontFamily":"inherit","color":"var(--text)","boxShadow":"0 1px 2px rgba(30,20,60,0.04)","maxWidth":"180px"};
const st43 = {"appearance":"none","padding":"9px 14px","border":"1px solid var(--border-2)","background":"var(--card)","borderRadius":"12px","cursor":"pointer","fontSize":"13.5px","fontWeight":"600","fontFamily":"inherit","color":"var(--text)","boxShadow":"0 1px 2px rgba(30,20,60,0.04)"};
const st44 = {"display":"flex","alignItems":"center","gap":"9px","padding":"9px 14px","border":"1px solid var(--border-2)","background":"var(--card)","borderRadius":"12px","cursor":"pointer","fontSize":"13.5px","fontWeight":"600","color":"var(--text)","boxShadow":"0 1px 2px rgba(30,20,60,0.04)","fontFamily":"inherit"};
const st45 = {"textAlign":"left","padding":"8px 10px","border":"none","background":"transparent","borderRadius":"9px","cursor":"pointer","fontSize":"13px","fontWeight":"600","color":"var(--text-2)","fontFamily":"inherit"};
const st46 = {"padding":"9px 14px","border":"1px solid var(--border-2)","borderRadius":"12px","background":"#F4F3F7","color":"var(--text-2)","fontSize":"13px","fontWeight":"600","fontFamily":"inherit","cursor":"pointer"};
const st47 = {"display":"none"};
const st48 = {"display":"flex","flexDirection":"column","gap":"18px","padding":"26px 32px 56px"};
const st49 = {"display":"flex","alignItems":"center","gap":"13px","background":"var(--primary-softer)","border":"1px solid var(--border-2)","borderRadius":"16px","padding":"14px 16px"};
const st50 = {"color":"var(--primary)","display":"flex","flex":"none"};
const st51 = {"fontSize":"13.5px","color":"var(--text-2)","fontWeight":"500"};
const st52 = {"display":"grid","gridTemplateColumns":"repeat(4,1fr)","gap":"16px"};
const st53 = {"background":"var(--card)","border":"1px solid var(--border)","borderRadius":"18px","padding":"18px","boxShadow":"0 1px 8px rgba(30,20,60,0.04)"};
const st54 = {"display":"flex","alignItems":"flex-start","justifyContent":"space-between"};
const st55 = {"fontSize":"13px","color":"var(--text-2)","fontWeight":"500","marginTop":"15px"};
const st56 = {"fontSize":"28px","fontWeight":"700","letterSpacing":"-0.03em","marginTop":"3px","fontVariantNumeric":"tabular-nums"};
const st57 = {"height":"30px","width":"72%","marginTop":"6px"};
const st58 = {"fontSize":"12px","color":"var(--text-3)","marginTop":"7px"};
const st59 = {"display":"grid","gridTemplateColumns":"1.75fr 1fr","gap":"16px"};
const st60 = {"background":"var(--card)","border":"1px solid var(--border)","borderRadius":"18px","padding":"20px 20px 14px","boxShadow":"0 1px 8px rgba(30,20,60,0.04)","display":"flex","flexDirection":"column"};
const st61 = {"display":"flex","alignItems":"center","justifyContent":"space-between","marginBottom":"6px"};
const st62 = {"fontSize":"15px","fontWeight":"700","letterSpacing":"-0.01em"};
const st63 = {"display":"flex","gap":"16px"};
const st64 = {"display":"flex","alignItems":"center","gap":"6px","fontSize":"12px","fontWeight":"600","color":"var(--text-2)"};
const st65 = {"width":"9px","height":"9px","borderRadius":"3px","background":"var(--primary)"};
const st66 = {"width":"9px","height":"9px","borderRadius":"3px","background":"var(--secondary)"};
const st67 = {"height":"100%","minHeight":"210px","width":"100%"};
const st68 = {"background":"var(--card)","border":"1px solid var(--border)","borderRadius":"18px","padding":"20px","boxShadow":"0 1px 8px rgba(30,20,60,0.04)"};
const st69 = {"display":"flex","background":"var(--primary-softer)","borderRadius":"10px","padding":"3px"};
const st70 = {"display":"flex","alignItems":"center","gap":"12px","padding":"11px 0","borderTop":"1px solid var(--border)"};
const st71 = {"fontSize":"13.5px","fontWeight":"600","whiteSpace":"nowrap","overflow":"hidden","textOverflow":"ellipsis"};
const st72 = {"fontSize":"12px","color":"var(--text-3)","marginTop":"1px"};
const st73 = {"fontSize":"13.5px","fontWeight":"700","fontVariantNumeric":"tabular-nums"};
const st74 = {"display":"grid","gridTemplateColumns":"repeat(auto-fit,minmax(340px,1fr))","gap":"16px","alignItems":"start"};
const st75 = {"background":"var(--card)","border":"1px solid var(--border)","borderRadius":"18px","padding":"20px","boxShadow":"0 1px 8px rgba(30,20,60,0.04)","minWidth":"0"};
const st76 = {"display":"flex","alignItems":"center","justifyContent":"space-between","marginBottom":"4px"};
const st77 = {"display":"flex","alignItems":"center","gap":"9px"};
const st78 = {"color":"var(--blue)","display":"flex"};
const st79 = {"fontSize":"12.5px","color":"var(--text-3)","fontWeight":"500"};
const st80 = {"display":"grid","gridTemplateColumns":"1fr auto","alignItems":"center","gap":"14px","padding":"12px 0","borderTop":"1px solid var(--border)"};
const st81 = {"minWidth":"0"};
const st82 = {"fontSize":"12.5px","color":"var(--text-3)","fontWeight":"600","fontVariantNumeric":"tabular-nums","whiteSpace":"nowrap"};
const st83 = {"padding":"26px 4px 6px","fontSize":"13px","color":"var(--text-3)","lineHeight":"1.5"};
const st84 = {"display":"flex","alignItems":"center","gap":"9px","marginBottom":"4px"};
const st85 = {"color":"var(--amber)","display":"flex"};
const st86 = {"padding":"12px 0","borderTop":"1px solid var(--border)","minWidth":"0"};
const st87 = {"display":"flex","flexDirection":"column","gap":"20px","padding":"26px 32px 56px"};
const st88 = {"display":"flex","gap":"2px","borderBottom":"1px solid var(--border)"};
const st89 = {"display":"grid","gridTemplateColumns":"repeat(3,1fr)","gap":"16px"};
const st90 = {"fontSize":"13px","color":"var(--text-2)","fontWeight":"500","marginTop":"14px"};
const st91 = {"fontSize":"26px","fontWeight":"700","letterSpacing":"-0.03em","marginTop":"3px","fontVariantNumeric":"tabular-nums"};
const st92 = {"display":"flex","alignItems":"center","gap":"13px","background":"var(--amber-soft)","border":"1px solid #EAD49E","borderRadius":"14px","padding":"14px 16px"};
const st93 = {"color":"var(--amber)","display":"flex","flex":"none"};
const st94 = {"fontSize":"13.5px","color":"#7A5A14","fontWeight":"500"};
const st95 = {"fontWeight":"700"};
const st96 = {"display":"grid","gridTemplateColumns":"1.75fr 1fr","gap":"16px","alignItems":"start"};
const st97 = {"display":"flex","alignItems":"center","justifyContent":"space-between","marginBottom":"6px","gap":"12px"};
const st98 = {"fontSize":"15px","fontWeight":"700","letterSpacing":"-0.01em","marginBottom":"8px"};
const st99 = {"background":"var(--card)","border":"1px solid var(--border)","borderRadius":"18px","overflowX":"auto","boxShadow":"0 1px 8px rgba(30,20,60,0.04)"};
const st100 = {"width":"100%","minWidth":"760px","borderCollapse":"collapse","fontSize":"13.5px"};
const st101 = {"borderBottom":"1px solid var(--border)"};
const st102 = {"textAlign":"left","padding":"14px 18px","fontSize":"11px","fontWeight":"700","textTransform":"uppercase","letterSpacing":"0.05em","cursor":"pointer","userSelect":"none"};
const st103 = {"textAlign":"right","padding":"14px 18px","fontSize":"11px","fontWeight":"700","textTransform":"uppercase","letterSpacing":"0.05em","cursor":"pointer","userSelect":"none"};
const st104 = {"padding":"13px 18px","fontWeight":"600"};
const st105 = {"padding":"13px 18px","textAlign":"right","color":"var(--text-2)","fontVariantNumeric":"tabular-nums"};
const st106 = {"padding":"13px 18px","textAlign":"right","fontWeight":"600","fontVariantNumeric":"tabular-nums"};
const st107 = {"padding":"13px 18px","textAlign":"right","fontWeight":"700","color":"var(--secondary)","fontVariantNumeric":"tabular-nums"};
const st108 = {"padding":"13px 18px","textAlign":"right"};
const st109 = {"padding":"13px 18px","color":"var(--text-2)"};
const st110 = {"position":"fixed","inset":"0","zIndex":"40","background":"rgba(30,20,60,0.28)","display":"flex","alignItems":"center","justifyContent":"center"};
const st111 = {"width":"420px","maxWidth":"92vw","background":"var(--card)","borderRadius":"20px","boxShadow":"0 24px 60px rgba(30,20,60,0.24)","padding":"24px","display":"flex","flexDirection":"column","gap":"14px","animation":"fadeIn .16s ease"};
const st112 = {"fontSize":"16px","fontWeight":"700"};
const st113 = {"display":"flex","flexDirection":"column","gap":"5px"};
const st114 = {"fontSize":"12px","fontWeight":"600","color":"var(--text-2)"};
const st115 = {"padding":"10px 12px","border":"1px solid var(--border-2)","borderRadius":"10px","fontSize":"13.5px"};
const st116 = {"display":"flex","gap":"10px","marginTop":"6px"};
const st117 = {"flex":"1","padding":"10px","border":"1px solid var(--border-2)","background":"var(--card)","borderRadius":"11px","fontSize":"13.5px","fontWeight":"600","cursor":"pointer","color":"var(--text-2)"};
const st118 = {"flex":"1","padding":"10px","border":"none","background":"var(--primary)","color":"#fff","borderRadius":"11px","fontSize":"13.5px","fontWeight":"600","cursor":"pointer"};
const st119 = {"position":"fixed","inset":"0","zIndex":"40","background":"rgba(30,20,60,0.32)","display":"flex","alignItems":"center","justifyContent":"center"};
const st120 = {"width":"560px","maxWidth":"92vw","maxHeight":"82vh","background":"var(--card)","borderRadius":"20px","boxShadow":"0 24px 60px rgba(30,20,60,0.24)","display":"flex","flexDirection":"column","animation":"fadeIn .16s ease","overflow":"hidden"};
const st121 = {"display":"flex","alignItems":"center","gap":"12px","padding":"18px 20px","borderBottom":"1px solid var(--border)","flex":"none"};
const st122 = {"width":"38px","height":"38px","flex":"none","borderRadius":"11px","background":"linear-gradient(135deg,var(--primary),var(--secondary))","color":"#fff","fontWeight":"700","fontSize":"14px","display":"flex","alignItems":"center","justifyContent":"center"};
const st123 = {"fontSize":"15px","fontWeight":"700"};
const st124 = {"width":"28px","height":"28px","flex":"none","border":"none","borderRadius":"9px","background":"var(--primary-softer)","color":"var(--text-2)","cursor":"pointer","fontSize":"15px","lineHeight":"1","display":"flex","alignItems":"center","justifyContent":"center"};
const st125 = {"flex":"1","minHeight":"0","overflowY":"auto","padding":"20px","display":"flex","flexDirection":"column","gap":"14px","background":"var(--bg)"};
const st126 = {"display":"flex","alignItems":"baseline","gap":"8px","marginBottom":"5px"};
const st127 = {"fontSize":"11.5px","fontWeight":"700","opacity":"0.85"};
const st128 = {"fontSize":"10.5px","opacity":"0.65"};
const st129 = {"fontSize":"13px","fontWeight":"700","marginBottom":"4px"};
const st130 = {"fontSize":"13px","lineHeight":"1.55","whiteSpace":"pre-wrap"};
const st131 = {"display":"flex","flexDirection":"column","alignItems":"center","justifyContent":"center","padding":"40px 10px","textAlign":"center"};
const st132 = {"width":"44px","height":"44px","borderRadius":"13px","background":"var(--primary-soft)","color":"var(--primary-2)","display":"flex","alignItems":"center","justifyContent":"center"};
const st133 = {"fontSize":"13.5px","color":"var(--text-3)","marginTop":"12px"};
const st134 = {"flex":"none","borderTop":"1px solid var(--border)","padding":"14px 18px","display":"flex","flexDirection":"column","gap":"8px"};
const st135 = {"width":"100%","padding":"8px 10px","border":"1px solid var(--border-2)","borderRadius":"9px","fontSize":"13px","fontWeight":"600","color":"var(--text)"};
const st136 = {"display":"flex","gap":"8px","alignItems":"flex-end"};
const st137 = {"flex":"1","minHeight":"44px","maxHeight":"120px","padding":"8px 10px","border":"1px solid var(--border-2)","borderRadius":"9px","fontSize":"13px","color":"var(--text)","resize":"vertical","fontFamily":"inherit","lineHeight":"1.5"};
const st138 = {"display":"flex","flexDirection":"column","gap":"20px","paddingTop":"0px","paddingBottom":"0px","paddingLeft":"30px","paddingRight":"30px"};
const st139 = {"width":"100%","minHeight":"64px","border":"none","outline":"none","resize":"vertical","fontSize":"15px","fontFamily":"inherit","color":"var(--text)","background":"transparent"};
const st140 = {"display":"flex","alignItems":"center","gap":"7px","fontSize":"12.5px","color":"var(--primary-2)","fontWeight":"600","marginTop":"2px"};
const st141 = {"width":"7px","height":"7px","borderRadius":"50%","background":"var(--primary)","display":"inline-block","animation":"pulse 1s infinite"};
const st142 = {"display":"flex","alignItems":"center","justifyContent":"space-between","marginTop":"10px","gap":"10px","flexWrap":"wrap"};
const st143 = {"display":"flex","alignItems":"center","gap":"10px"};
const st144 = {"display":"flex","alignItems":"center","gap":"6px","padding":"8px 12px","border":"1px solid var(--border-2)","background":"var(--card)","borderRadius":"10px","fontSize":"12.5px","fontWeight":"600","cursor":"pointer","color":"var(--text-2)"};
const st145 = {"fontSize":"12px","color":"var(--neg)","fontWeight":"600","display":"flex","alignItems":"center","gap":"6px"};
const st146 = {"width":"7px","height":"7px","borderRadius":"50%","background":"var(--neg)","display":"inline-block","animation":"pulse 1s infinite"};
const st147 = {"fontSize":"12px","color":"var(--neg)","fontWeight":"600"};
const st148 = {"display":"flex","gap":"8px"};
const st149 = {"display":"flex","alignItems":"center","gap":"6px","padding":"9px 15px","border":"none","background":"var(--primary)","color":"#fff","borderRadius":"11px","fontSize":"13px","fontWeight":"600","cursor":"pointer"};
const st150 = {"display":"flex","alignItems":"center","justifyContent":"space-between"};
const st151 = {"fontSize":"13px","color":"var(--text-3)","fontWeight":"600"};
const st152 = {"columns":"4 240px","columnGap":"16px"};
const st153 = {"display":"flex","alignItems":"center","gap":"6px","position":"absolute","top":"10px","right":"10px"};
const st154 = {"width":"24px","height":"24px","border":"none","borderRadius":"50%","background":"rgba(255,255,255,0.7)","color":"var(--text-2)","cursor":"pointer","display":"flex","alignItems":"center","justifyContent":"center","fontSize":"14px","lineHeight":"1"};
const st155 = {"fontSize":"14px","color":"var(--text)","lineHeight":"1.55","whiteSpace":"pre-wrap","paddingRight":"56px"};
const st156 = {"textDecoration":"none","display":"flex","flexDirection":"column","gap":"8px","paddingRight":"56px"};
const st157 = {"width":"32px","height":"32px","borderRadius":"9px","background":"rgba(255,255,255,0.65)","display":"flex","alignItems":"center","justifyContent":"center","color":"var(--text-2)"};
const st158 = {"fontSize":"13.5px","fontWeight":"700","color":"var(--text)","wordBreak":"break-word"};
const st159 = {"fontSize":"12px","color":"var(--text-2)","wordBreak":"break-all"};
const st160 = {"display":"flex","flexDirection":"column","gap":"8px"};
const st161 = {"width":"100%","borderRadius":"11px","background":"#000","display":"block","maxHeight":"220px"};
const st162 = {"fontSize":"12.5px","fontWeight":"600","color":"var(--text-2)","wordBreak":"break-word"};
const st163 = {"fontSize":"11px","color":"var(--text-3)","marginTop":"10px","fontWeight":"500"};
const st164 = {"display":"flex","flexDirection":"column","gap":"12px"};
const st165 = {"fontSize":"14px","color":"var(--text)","lineHeight":"1.55","whiteSpace":"pre-wrap","paddingRight":"56px","maxWidth":"640px"};
const st166 = {"textDecoration":"none","display":"flex","alignItems":"center","gap":"12px","paddingRight":"56px"};
const st167 = {"width":"32px","height":"32px","flex":"none","borderRadius":"9px","background":"rgba(255,255,255,0.65)","display":"flex","alignItems":"center","justifyContent":"center","color":"var(--text-2)"};
const st168 = {"fontSize":"13.5px","fontWeight":"700","color":"var(--text)"};
const st169 = {"display":"flex","alignItems":"center","gap":"14px"};
const st170 = {"width":"180px","flex":"none","borderRadius":"11px","background":"#000","display":"block"};
const st171 = {"fontSize":"13px","fontWeight":"600","color":"var(--text-2)","wordBreak":"break-word"};
const st172 = {"display":"flex","flexDirection":"column","alignItems":"center","justifyContent":"center","padding":"70px 20px","textAlign":"center"};
const st173 = {"width":"56px","height":"56px","borderRadius":"16px","background":"var(--primary-soft)","color":"var(--primary-2)","display":"flex","alignItems":"center","justifyContent":"center"};
const st174 = {"fontSize":"14px","color":"var(--text-3)","marginTop":"14px","maxWidth":"340px","lineHeight":"1.5"};
const st175 = {"fontSize":"11.5px","fontWeight":"700","textTransform":"uppercase","letterSpacing":"0.05em","color":"var(--text-3)"};
const st176 = {"fontSize":"23px","fontWeight":"800","letterSpacing":"-0.02em","marginTop":"7px"};
const st177 = {"padding":"13px 18px","color":"var(--text-2)","whiteSpace":"nowrap"};
const st178 = {"padding":"13px 18px"};
const st179 = {"padding":"8px 18px 18px","display":"flex","flexDirection":"column","gap":"9px"};
const st180 = {"padding":"44px 20px","textAlign":"center","fontSize":"14px","color":"var(--text-3)"};
const st181 = {"display":"flex","alignItems":"center","justifyContent":"space-between","gap":"12px","padding":"13px 18px","borderTop":"1px solid var(--border)"};
const st182 = {"fontSize":"12.5px","color":"var(--text-2)","fontWeight":"600","whiteSpace":"nowrap"};
const st183 = {"display":"flex","flexDirection":"column","gap":"16px","padding":"22px 32px 48px"};
const st184 = {"display":"flex","alignItems":"center","gap":"10px","flexWrap":"wrap"};
const st185 = {"display":"flex","alignItems":"center","gap":"6px","fontSize":"13.5px","fontWeight":"700"};
const st186 = {"padding":"4px 6px","color":"var(--text)"};
const st187 = {"width":"210px","padding":"9px 13px","border":"1px solid var(--border-2)","borderRadius":"12px","background":"var(--card)","fontFamily":"inherit","fontSize":"13px","color":"var(--text)","outline":"none"};
const st188 = {"display":"flex","alignItems":"center","gap":"7px","padding":"9px 14px","border":"1px solid var(--border-2)","borderRadius":"12px","background":"var(--card)","color":"var(--text-2)","fontSize":"13px","fontWeight":"600","fontFamily":"inherit","cursor":"pointer"};
const st189 = {"display":"flex","alignItems":"center","gap":"7px","padding":"9px 15px","border":"none","borderRadius":"12px","background":"var(--primary)","color":"#fff","fontSize":"13px","fontWeight":"600","fontFamily":"inherit","cursor":"pointer"};
const st190 = {"display":"flex","gap":"2px","background":"#F4F3F7","borderRadius":"11px","padding":"3px"};
const st191 = {"display":"grid","gridTemplateColumns":"repeat(auto-fill,minmax(200px,1fr))","gap":"14px"};
const st192 = {"fontSize":"13.5px","fontWeight":"600","lineHeight":"1.35","wordBreak":"break-word"};
const st193 = {"fontSize":"11.5px","color":"var(--text-3)","marginTop":"3px","fontWeight":"500"};
const st194 = {"display":"flex","gap":"4px"};
const st195 = {"flex":"1","padding":"6px","border":"1px solid var(--border)","borderRadius":"9px","background":"var(--card)","color":"var(--text-2)","cursor":"pointer","display":"flex","alignItems":"center","justifyContent":"center"};
const st196 = {"flex":"1","padding":"6px","border":"1px solid var(--border)","borderRadius":"9px","background":"var(--card)","color":"var(--text-3)","cursor":"pointer","display":"flex","alignItems":"center","justifyContent":"center"};
const st197 = {"background":"var(--card)","border":"1px solid var(--border)","borderRadius":"16px","overflow":"hidden"};
const st198 = {"fontSize":"12px","color":"var(--text-3)","fontWeight":"500","width":"170px","textAlign":"right"};
const st199 = {"padding":"6px","border":"1px solid var(--border)","borderRadius":"9px","background":"var(--card)","color":"var(--text-2)","cursor":"pointer","display":"flex"};
const st200 = {"padding":"6px","border":"1px solid var(--border)","borderRadius":"9px","background":"var(--card)","color":"var(--text-3)","cursor":"pointer","display":"flex"};
const st201 = {"display":"flex","flexDirection":"column","alignItems":"center","justifyContent":"center","padding":"80px 20px","textAlign":"center"};
const st202 = {"width":"58px","height":"58px","borderRadius":"17px","background":"var(--primary-soft)","color":"var(--primary-2)","display":"flex","alignItems":"center","justifyContent":"center"};
const st203 = {"fontSize":"15.5px","fontWeight":"700","marginTop":"16px"};
const st204 = {"fontSize":"13.5px","color":"var(--text-3)","marginTop":"6px","maxWidth":"340px","lineHeight":"1.55"};
const st205 = {"fontSize":"12px","color":"var(--text-3)","fontWeight":"500"};
const st206 = {"width":"400px","maxWidth":"92vw","background":"var(--card)","borderRadius":"20px","boxShadow":"0 24px 60px rgba(30,20,60,0.24)","padding":"22px","display":"flex","flexDirection":"column","gap":"14px"};
const st207 = {"padding":"11px 13px","border":"1px solid var(--border-2)","borderRadius":"12px","fontFamily":"inherit","fontSize":"14px","color":"var(--text)","outline":"none"};
const st208 = {"display":"flex","justifyContent":"flex-end","gap":"8px"};
const st209 = {"padding":"9px 15px","border":"1px solid var(--border-2)","borderRadius":"11px","background":"var(--card)","color":"var(--text-2)","fontSize":"13px","fontWeight":"600","fontFamily":"inherit","cursor":"pointer"};
const st210 = {"padding":"9px 15px","border":"none","borderRadius":"11px","background":"var(--primary)","color":"#fff","fontSize":"13px","fontWeight":"600","fontFamily":"inherit","cursor":"pointer"};
const st211 = {"position":"fixed","inset":"0","zIndex":"40","background":"rgba(20,12,40,0.66)","display":"flex","alignItems":"center","justifyContent":"center","padding":"30px"};
const st212 = {"width":"520px","maxWidth":"94vw","background":"var(--card)","borderRadius":"22px","boxShadow":"0 28px 70px rgba(20,12,40,0.4)","overflow":"hidden","display":"flex","flexDirection":"column"};
const st213 = {"background":"#0E0A1A","display":"flex","alignItems":"center","justifyContent":"center","minHeight":"280px"};
const st214 = {"padding":"16px 20px","display":"flex","alignItems":"center","gap":"14px"};
const st215 = {"fontSize":"14.5px","fontWeight":"700","wordBreak":"break-word"};
const st216 = {"fontSize":"12px","color":"var(--text-3)","marginTop":"3px","fontWeight":"500"};
const st217 = {"padding":"9px 14px","border":"1px solid var(--border-2)","borderRadius":"11px","background":"var(--card)","color":"var(--text-2)","fontSize":"13px","fontWeight":"600","fontFamily":"inherit","cursor":"pointer"};
const st218 = {"padding":"9px 14px","border":"none","borderRadius":"11px","background":"var(--primary)","color":"#fff","fontSize":"13px","fontWeight":"600","fontFamily":"inherit","cursor":"pointer"};
const st219 = {"display":"flex","flexDirection":"column","gap":"16px","padding":"22px 32px 40px","maxWidth":"1180px"};
const st220 = {"display":"grid","gridTemplateColumns":"minmax(0,1.25fr) minmax(0,1fr)","gap":"16px","alignItems":"start"};
const st221 = {"display":"flex","flexDirection":"column","gap":"16px","minWidth":"0"};
const st222 = {"background":"var(--card)","border":"1px solid var(--border)","borderRadius":"18px","padding":"20px","boxShadow":"0 1px 8px rgba(30,20,60,0.04)","display":"flex","flexDirection":"column","gap":"16px","minWidth":"0"};
const st223 = {"display":"flex","alignItems":"center","gap":"18px"};
const st224 = {"width":"74px","height":"74px","flex":"none","borderRadius":"22px","background":"linear-gradient(135deg,var(--primary),var(--secondary))","color":"#fff","fontSize":"23px","fontWeight":"700","letterSpacing":"-0.02em","display":"flex","alignItems":"center","justifyContent":"center"};
const st225 = {"display":"flex","flexDirection":"column","gap":"9px"};
const st226 = {"fontSize":"13px","color":"var(--text-2)","fontWeight":"500","lineHeight":"1.5"};
const st227 = {"display":"grid","gridTemplateColumns":"1fr 1fr","gap":"12px"};
const st228 = {"display":"flex","flexDirection":"column","gap":"6px","minWidth":"0"};
const st229 = {"fontSize":"11px","fontWeight":"700","textTransform":"uppercase","letterSpacing":"0.05em","color":"var(--text-3)"};
const st230 = {"width":"100%","minWidth":"0","padding":"10px 12px","border":"1px solid var(--border-2)","borderRadius":"11px","background":"var(--card)","color":"var(--text)","fontSize":"13.5px","fontWeight":"500","fontFamily":"inherit"};
const st231 = {"width":"100%","minWidth":"0","padding":"10px 12px","border":"1px solid var(--border)","borderRadius":"11px","background":"#F6F5FA","color":"var(--text-3)","fontSize":"13.5px","overflow":"hidden","textOverflow":"ellipsis","whiteSpace":"nowrap"};
const st232 = {"fontSize":"11.5px","color":"var(--text-3)"};
const st233 = {"display":"flex","alignItems":"center","gap":"12px"};
const st234 = {"padding":"10px 18px","border":"none","borderRadius":"11px","background":"var(--primary)","color":"#fff","fontSize":"13px","fontWeight":"600","fontFamily":"inherit","cursor":"pointer"};
const st235 = {"fontSize":"13px","fontWeight":"600","color":"var(--secondary)"};
const st236 = {"background":"var(--card)","border":"1px solid var(--border)","borderRadius":"18px","padding":"20px","boxShadow":"0 1px 8px rgba(30,20,60,0.04)","display":"flex","alignItems":"center","justifyContent":"space-between","gap":"16px"};
const st237 = {"fontSize":"13px","color":"var(--text-3)","marginTop":"3px"};
const st238 = {"display":"flex","alignItems":"center","gap":"8px","flex":"none","padding":"8px 14px","borderRadius":"999px","background":"var(--secondary-soft)","color":"var(--secondary)","fontSize":"13px","fontWeight":"700"};
const st239 = {"flex":"none","padding":"10px 18px","border":"none","borderRadius":"11px","background":"var(--primary)","color":"#fff","fontSize":"13px","fontWeight":"600","fontFamily":"inherit","cursor":"pointer"};
const st240 = {"background":"var(--card)","border":"1px solid var(--border)","borderRadius":"18px","padding":"20px","boxShadow":"0 1px 8px rgba(30,20,60,0.04)","display":"flex","flexDirection":"column","gap":"14px","minWidth":"0"};
const st241 = {"display":"flex","flexDirection":"column","gap":"6px","gridColumn":"span 2","minWidth":"0"};
const st242 = {"width":"100%","minWidth":"0","padding":"10px 12px","border":"1px solid var(--border-2)","borderRadius":"11px","background":"var(--card)","color":"var(--text)","fontSize":"13.5px","fontFamily":"inherit"};
const st243 = {"display":"flex","alignItems":"center","gap":"11px"};
const st244 = {"flex":"1","height":"6px","borderRadius":"999px","background":"var(--border)","overflow":"hidden"};
const st245 = {"background":"#FAFAFC","border":"1px solid var(--border)","borderRadius":"18px","padding":"20px","display":"flex","flexDirection":"column","gap":"2px"};
const st246 = {"display":"flex","alignItems":"center","justifyContent":"space-between","gap":"12px","marginBottom":"6px"};
const st247 = {"fontSize":"15px","fontWeight":"700","letterSpacing":"-0.01em","color":"var(--text-3)"};
const st248 = {"padding":"4px 10px","borderRadius":"999px","background":"#F1F0F5","color":"var(--text-3)","fontSize":"11px","fontWeight":"700","textTransform":"uppercase","letterSpacing":"0.05em"};
const st249 = {"display":"flex","alignItems":"center","justifyContent":"space-between","gap":"16px","padding":"11px 0","borderTop":"1px solid var(--border)","opacity":"0.55"};
const st250 = {"fontSize":"13.5px","fontWeight":"600","color":"var(--text-2)"};
const st251 = {"fontSize":"12.5px","color":"var(--text-3)","marginTop":"2px"};
const st252 = {"position":"relative","width":"42px","height":"24px","flex":"none","borderRadius":"999px","background":"var(--border-2)"};
const st253 = {"position":"absolute","top":"3px","left":"3px","width":"18px","height":"18px","borderRadius":"50%","background":"#fff","boxShadow":"0 1px 3px rgba(30,20,60,0.15)"};
const st254 = {"display":"flex","alignItems":"center","gap":"12px","marginTop":"6px"};
const st255 = {"fontSize":"11px","fontWeight":"700","textTransform":"uppercase","letterSpacing":"0.08em","color":"var(--text-3)"};
const st256 = {"flex":"1","height":"1px","background":"var(--border)"};
const st257 = {"background":"#FAFAFC","border":"1px solid var(--border)","borderRadius":"18px","padding":"20px","display":"flex","alignItems":"center","justifyContent":"space-between","gap":"16px"};
const st258 = {"fontSize":"13px","color":"var(--text-3)","marginTop":"4px"};
const st259 = {"flex":"none","padding":"10px 18px","border":"1px solid var(--border-2)","borderRadius":"11px","background":"#F1F0F5","color":"var(--text-3)","fontSize":"13px","fontWeight":"600","fontFamily":"inherit","cursor":"not-allowed"};
const st260 = {"width":"200px","padding":"9px 13px","border":"1px solid var(--border-2)","borderRadius":"12px","background":"var(--card)","fontFamily":"inherit","fontSize":"13px","color":"var(--text)","outline":"none"};
const st261 = {"display":"flex","alignItems":"center","gap":"8px","flexWrap":"wrap"};
const st262 = {"fontSize":"11px","fontWeight":"700","opacity":"0.65"};
const st263 = {"display":"grid","gridTemplateColumns":"repeat(auto-fill,minmax(210px,1fr))","gap":"14px"};
const st264 = {"display":"flex","opacity":"0.7"};
const st265 = {"position":"absolute","left":"0","right":"0","top":"34px","zIndex":"31","background":"var(--card)","border":"1px solid var(--border)","borderRadius":"14px","boxShadow":"0 16px 40px rgba(30,20,60,0.18)","padding":"6px","display":"flex","flexDirection":"column","gap":"2px"};
const st266 = {"fontSize":"12px","color":"var(--text-3)","fontWeight":"500","width":"160px","textAlign":"right"};
const st267 = {"padding":"16px 20px","display":"flex","alignItems":"center","gap":"12px","flexWrap":"wrap"};
const st268 = {"flex":"1","minWidth":"180px"};
const st269 = {"display":"flex","flexDirection":"column","gap":"14px","padding":"22px 32px 28px","maxWidth":"1080px"};
const st270 = {"display":"flex","alignItems":"center","gap":"11px","padding":"14px 17px","borderRadius":"15px","background":"#F1F0F5","border":"1px solid var(--border-2)"};
const st271 = {"color":"var(--text-3)","display":"flex","flex":"none"};
const st272 = {"fontSize":"14px","fontWeight":"700","color":"var(--text-2)"};
const st273 = {"opacity":"0.45","filter":"grayscale(1)","pointerEvents":"none","userSelect":"none","display":"flex","flexDirection":"column","gap":"14px"};
const st274 = {"display":"flex","alignItems":"center","gap":"7px","fontSize":"12px","fontWeight":"600","color":"var(--text-3)"};
const st275 = {"width":"7px","height":"7px","borderRadius":"50%","background":"var(--green)","display":"inline-block"};
const st276 = {"fontSize":"12px","fontWeight":"600","color":"var(--text-2)","background":"var(--primary-softer)","border":"1px solid var(--border-2)","borderRadius":"999px","padding":"4px 11px"};
const st277 = {"padding":"7px 13px","border":"1px solid var(--border-2)","borderRadius":"11px","background":"var(--card)","color":"var(--text-2)","fontSize":"12.5px","fontWeight":"600","fontFamily":"inherit","cursor":"pointer"};
const st278 = {"background":"var(--card)","border":"1px solid var(--border)","borderRadius":"20px","boxShadow":"0 1px 8px rgba(30,20,60,0.04)","padding":"22px","display":"flex","flexDirection":"column","gap":"16px","minHeight":"400px","maxHeight":"56vh","overflowY":"auto"};
const st279 = {"display":"flex","flexDirection":"column","gap":"18px","padding":"14px 4px"};
const st280 = {"width":"46px","height":"46px","flex":"none","borderRadius":"14px","background":"linear-gradient(135deg,var(--primary),var(--secondary))","color":"#fff","display":"flex","alignItems":"center","justifyContent":"center"};
const st281 = {"fontSize":"17px","fontWeight":"700","letterSpacing":"-0.02em"};
const st282 = {"fontSize":"13.5px","color":"var(--text-3)","marginTop":"3px"};
const st283 = {"display":"grid","gridTemplateColumns":"repeat(auto-fit,minmax(230px,1fr))","gap":"10px"};
const st284 = {"textAlign":"left","padding":"13px 15px","border":"1px solid var(--border-2)","borderRadius":"14px","background":"var(--bg)","color":"var(--text)","fontSize":"13.5px","fontWeight":"600","lineHeight":"1.45","fontFamily":"inherit","cursor":"pointer"};
const st285 = {"display":"flex","justifyContent":"flex-end","gap":"10px","alignItems":"flex-end"};
const st286 = {"maxWidth":"72%","background":"var(--primary)","color":"#fff","borderRadius":"18px 18px 5px 18px","padding":"12px 16px","fontSize":"14px","lineHeight":"1.55","whiteSpace":"pre-wrap","textWrap":"pretty","boxShadow":"0 2px 10px rgba(124,92,246,0.22)"};
const st287 = {"width":"28px","height":"28px","flex":"none","borderRadius":"50%","background":"var(--primary-soft)","color":"var(--primary-2)","display":"flex","alignItems":"center","justifyContent":"center","fontSize":"12px","fontWeight":"700"};
const st288 = {"display":"flex","gap":"11px","alignItems":"flex-start"};
const st289 = {"width":"28px","height":"28px","flex":"none","borderRadius":"9px","background":"linear-gradient(135deg,var(--primary),var(--secondary))","color":"#fff","display":"flex","alignItems":"center","justifyContent":"center","marginTop":"2px"};
const st290 = {"maxWidth":"70ch","minWidth":"0","display":"flex","flexDirection":"column","gap":"9px","background":"var(--card)","border":"1px solid var(--border)","borderRadius":"5px 18px 18px 18px","padding":"15px 17px","boxShadow":"0 1px 8px rgba(30,20,60,0.05)"};
const st291 = {"fontSize":"14px","lineHeight":"1.6","textWrap":"pretty"};
const st292 = {"display":"flex","gap":"10px","alignItems":"flex-start"};
const st293 = {"width":"5px","height":"5px","flex":"none","borderRadius":"50%","background":"var(--primary)","marginTop":"8px"};
const st294 = {"fontSize":"13.5px","lineHeight":"1.55","color":"var(--text-2)","textWrap":"pretty"};
const st295 = {"display":"flex","gap":"10px","alignItems":"flex-start","background":"var(--secondary-soft)","borderRadius":"12px","padding":"11px 13px"};
const st296 = {"fontSize":"11px","fontWeight":"800","letterSpacing":"0.06em","color":"var(--secondary)","flex":"none","marginTop":"1px"};
const st297 = {"fontSize":"13.5px","lineHeight":"1.5","fontWeight":"600","color":"var(--text)","textWrap":"pretty"};
const st298 = {"display":"flex","gap":"11px","alignItems":"center"};
const st299 = {"width":"28px","height":"28px","flex":"none","borderRadius":"9px","background":"linear-gradient(135deg,var(--primary),var(--secondary))","color":"#fff","display":"flex","alignItems":"center","justifyContent":"center"};
const st300 = {"display":"flex","alignItems":"center","gap":"5px","background":"var(--card)","border":"1px solid var(--border)","borderRadius":"5px 18px 18px 18px","padding":"14px 16px"};
const st301 = {"width":"6px","height":"6px","borderRadius":"50%","background":"var(--primary)","animation":"pulse 1.1s infinite"};
const st302 = {"width":"6px","height":"6px","borderRadius":"50%","background":"var(--primary)","animation":"pulse 1.1s infinite .18s"};
const st303 = {"width":"6px","height":"6px","borderRadius":"50%","background":"var(--primary)","animation":"pulse 1.1s infinite .36s"};
const st304 = {"fontSize":"13px","color":"var(--neg)","fontWeight":"600"};
const st305 = {"background":"var(--card)","border":"1px solid var(--border-2)","borderRadius":"18px","padding":"14px 16px","display":"flex","flexDirection":"column","gap":"10px","boxShadow":"0 1px 8px rgba(30,20,60,0.04)"};
const st306 = {"width":"100%","minHeight":"52px","border":"none","outline":"none","resize":"vertical","fontFamily":"inherit","fontSize":"14px","lineHeight":"1.55","color":"var(--text)","background":"transparent"};
const st307 = {"display":"flex","alignItems":"center","justifyContent":"space-between","gap":"10px"};
const st308 = {"fontSize":"11.5px","color":"var(--text-3)","fontWeight":"500"};
const st309 = {"display":"flex","flexDirection":"column","alignItems":"center","justifyContent":"center","padding":"90px 20px","textAlign":"center"};
const st310 = {"width":"64px","height":"64px","borderRadius":"18px","background":"var(--primary-soft)","color":"var(--primary-2)","display":"flex","alignItems":"center","justifyContent":"center"};
const st311 = {"fontSize":"17px","fontWeight":"700","color":"var(--text)","marginTop":"18px"};
const st312 = {"fontSize":"14px","color":"var(--text-3)","marginTop":"6px","maxWidth":"380px","lineHeight":"1.5"};
const st313 = {"color":"var(--text-2)"};

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
            <svg width="35" height="35" viewBox="0 0 64 64" aria-hidden="true" style={st4}>
              <path d="M11 47 A 28 28 0 0 1 53 22" fill="none" stroke="currentColor" stroke-width="6.5" stroke-linecap="round"></path>
              <circle cx="47" cy="46" r="5.5" fill="currentColor"></circle>
            </svg>
          </div>
          <div>
            <div style={st5}>
              {"Rekolt"}
            </div>
            <div style={st6}>
              {"Creator Revenue Studio"}
            </div>
          </div>
        </div>
        <nav style={st7}>
          {(V.navGroups || []).map((g, _i5) => (
            <React.Fragment key={_i5}>
              <div style={st8}>
                <div style={st9}>
                  {g.label}
                </div>
                {(g.items || []).map((item, _i8) => (
                  <React.Fragment key={_i8}>
                    <button onClick={item.onClick} style={css(`display:flex;align-items:center;gap:12px;width:100%;padding:10px 12px;border:none;border-radius:11px;cursor:pointer;font-size:13.5px;font-weight:600;text-align:left;transition:background .15s,color .15s;background:${item.bg ?? ""};color:${item.fg ?? ""};`)} className={sp("hover", "background:var(--primary-softer)")}>
                      <span style={st10}>
                        {item.icon}
                      </span>
                      {" "}
                      <span style={st11}>
                        {item.label}
                      </span>
                      {" "}
                      {item.badge ? (
                        <React.Fragment>
                          <span style={st12}>
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
            <span style={st10}>
              {V.assistantItem.icon}
            </span>
            {" "}
            <span style={st11}>
              {"Ton assistant perso"}
            </span>
          </button>
        </nav>
        <div style={st11}></div>
        <button onClick={V.settingsItem.onClick} style={css(`display:flex;align-items:center;gap:12px;width:100%;padding:10px 12px;margin-bottom:10px;border:1px solid ${V.settingsItem.border ?? ""};border-radius:13px;cursor:pointer;font-size:13.5px;font-weight:600;text-align:left;background:${V.settingsItem.bg ?? ""};color:${V.settingsItem.fg ?? ""};`)}>
          <span style={st10}>
            {V.settingsItem.icon}
          </span>
          {" "}
          <span style={st11}>
            {V.settingsItem.label}
          </span>
        </button>
        <div style={st13}>
          {V.compte.photo ? (
            <React.Fragment>
              <img src={V.compte.photo} alt="" style={st14} />
            </React.Fragment>
          ) : null}
          {" "}
          {V.compte.sansPhoto ? (
            <React.Fragment>
              <div style={st15}>
                {V.compte.initiales}
              </div>
            </React.Fragment>
          ) : null}
          <div style={st16}>
            <div style={st17}>
              {V.compte.nom}
            </div>
            <div style={st18}>
              {V.compte.sous}
            </div>
          </div>
        </div>
        <button onClick={V.deconnexionItem.onClick} style={st19} className={sp("hover", "background:var(--neg-soft);color:var(--neg);border-color:var(--neg-soft)")}>
          <span style={st10}>
            {V.deconnexionItem.icon}
          </span>
          {" "}
          <span style={st11}>
            {V.deconnexionItem.label}
          </span>
        </button>
      </aside>
      <main style={st20}>
        <header style={st21}>
          <div>
            <div style={st22}>
              {V.pageTitle}
            </div>
            <div style={st23}>
              {V.pageSubtitle}
            </div>
          </div>
          {V.showPeriod ? (
            <React.Fragment>
              <div style={st24}>
                <button onClick={V.togglePeriod} style={st25} className={sp("hover", "border-color:var(--primary)")}>
                  <span style={st26}>
                    {V.calendarIcon}
                  </span>
                  {" "}
                  <span>
                    {V.periodLabel}
                  </span>
                  {" "}
                  <span style={st27}>
                    {V.chevronIcon}
                  </span>
                </button>
                {V.periodOpen ? (
                  <React.Fragment>
                    <div onClick={V.closePeriod} style={st28}></div>
                    <div onClick={V.stopProp} style={st29}>
                      <div style={st30}>
                        <div style={st31}>
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
                                  <span style={st26}>
                                    {V.checkIcon}
                                  </span>
                                </React.Fragment>
                              ) : null}
                            </button>
                          </React.Fragment>
                        ))}
                      </div>
                      <div style={st32}>
                        <div style={st33}>
                          <button onClick={V.dpPrev} style={st34} className={sp("hover", "border-color:var(--primary);color:var(--primary-2)")}>
                            {"‹"}
                          </button>
                          <div style={st35}>
                            {V.dpMonthLabel}
                          </div>
                          <button onClick={V.dpNext} style={st34} className={sp("hover", "border-color:var(--primary);color:var(--primary-2)")}>
                            {"›"}
                          </button>
                        </div>
                        <div style={st36}>
                          <div style={st37}>
                            {"LU"}
                          </div>
                          <div style={st37}>
                            {"MA"}
                          </div>
                          <div style={st37}>
                            {"ME"}
                          </div>
                          <div style={st37}>
                            {"JE"}
                          </div>
                          <div style={st37}>
                            {"VE"}
                          </div>
                          <div style={st37}>
                            {"SA"}
                          </div>
                          <div style={st37}>
                            {"DI"}
                          </div>
                        </div>
                        <div style={st38}>
                          {(V.dpCells || []).map((c, _i13) => (
                            <React.Fragment key={_i13}>
                              <button onClick={c.onClick} style={css(`height:38px;border:${c.ring ?? ""};background:${c.bg ?? ""};color:${c.fg ?? ""};font-weight:${c.weight ?? ""};border-radius:${c.radius ?? ""};font-size:13px;cursor:pointer;font-family:inherit;`)}>
                                {c.label}
                              </button>
                            </React.Fragment>
                          ))}
                        </div>
                        <div style={st39}>
                          <div style={st40}>
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
              <div style={st41}>
                <select value={V.fVendeur ?? ""} onChange={V.setFVendeur} style={st42} className={sp("hover", "border-color:var(--primary)")}>
                  {(V.vendeurOptions || []).map((o, _i9) => (
                    <React.Fragment key={_i9}>
                      <option value={o ?? ""}>
                        {o}
                      </option>
                    </React.Fragment>
                  ))}
                </select>
                <select value={V.fStatut ?? ""} onChange={V.setFStatut} style={st43} className={sp("hover", "border-color:var(--primary)")}>
                  {(V.statutOptions || []).map((o, _i9) => (
                    <React.Fragment key={_i9}>
                      <option value={o ?? ""}>
                        {o}
                      </option>
                    </React.Fragment>
                  ))}
                </select>
                <div style={st24}>
                  <button onClick={V.toggleDp} style={st44} className={sp("hover", "border-color:var(--primary)")}>
                    <span style={st26}>
                      {V.calendarIcon}
                    </span>
                    {" "}
                    <span>
                      {V.dpLabel}
                    </span>
                    {" "}
                    <span style={st27}>
                      {V.chevronIcon}
                    </span>
                  </button>
                  {V.dpOpen ? (
                    <React.Fragment>
                      <div onClick={V.closeDp} style={st28}></div>
                      <div onClick={V.stopProp} style={st29}>
                        <div style={st30}>
                          <div style={st31}>
                            {"Raccourcis"}
                          </div>
                          {(V.dpShortcuts || []).map((s, _i13) => (
                            <React.Fragment key={_i13}>
                              <button onClick={s.onClick} style={st45} className={sp("hover", "background:var(--primary-soft);color:var(--primary-2)")}>
                                {s.label}
                              </button>
                            </React.Fragment>
                          ))}
                        </div>
                        <div style={st32}>
                          <div style={st33}>
                            <button onClick={V.dpPrev} style={st34} className={sp("hover", "border-color:var(--primary);color:var(--primary-2)")}>
                              {"‹"}
                            </button>
                            <div style={st35}>
                              {V.dpMonthLabel}
                            </div>
                            <button onClick={V.dpNext} style={st34} className={sp("hover", "border-color:var(--primary);color:var(--primary-2)")}>
                              {"›"}
                            </button>
                          </div>
                          <div style={st36}>
                            <div style={st37}>
                              {"LU"}
                            </div>
                            <div style={st37}>
                              {"MA"}
                            </div>
                            <div style={st37}>
                              {"ME"}
                            </div>
                            <div style={st37}>
                              {"JE"}
                            </div>
                            <div style={st37}>
                              {"VE"}
                            </div>
                            <div style={st37}>
                              {"SA"}
                            </div>
                            <div style={st37}>
                              {"DI"}
                            </div>
                          </div>
                          <div style={st38}>
                            {(V.dpCells || []).map((c, _i14) => (
                              <React.Fragment key={_i14}>
                                <button onClick={c.onClick} style={css(`height:38px;border:${c.ring ?? ""};background:${c.bg ?? ""};color:${c.fg ?? ""};font-weight:${c.weight ?? ""};border-radius:${c.radius ?? ""};font-size:13px;cursor:pointer;font-family:inherit;`)}>
                                  {c.label}
                                </button>
                              </React.Fragment>
                            ))}
                          </div>
                          <div style={st39}>
                            <div style={st40}>
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
                    <button onClick={V.resetFilters} style={st46} className={sp("hover", "background:var(--primary-softer);color:var(--primary-2)")}>
                      {"Réinitialiser"}
                    </button>
                  </React.Fragment>
                ) : null}
                <input type="file" accept=".csv,.xlsx,.xls" ref={V.importCommandes.ref} onChange={V.importCommandes.onFichier} style={st47} />
                <button onClick={V.importCommandes.onClick} style={css(`display:flex;align-items:center;gap:8px;padding:9px 15px;border:none;border-radius:12px;background:var(--primary);color:#fff;font-size:13px;font-weight:700;font-family:inherit;cursor:pointer;box-shadow:0 2px 10px rgba(124,92,246,0.22);opacity:${V.importCommandes.op ?? ""};pointer-events:${V.importCommandes.pe ?? ""};`)} className={sp("hover", "background:var(--primary-2)")}>
                  {V.importCommandes.label}
                </button>
              </div>
            </React.Fragment>
          ) : null}
        </header>
        {V.isDashboard ? (
          <React.Fragment>
            <div style={st48}>
              {V.tableauDeBord.visible ? (
                <React.Fragment>
                  <div style={css(`padding:12px 16px;border-radius:13px;background:${V.tableauDeBord.bg ?? ""};color:${V.tableauDeBord.fg ?? ""};font-size:13px;font-weight:600;`)}>
                    {V.tableauDeBord.texte}
                  </div>
                </React.Fragment>
              ) : null}
              {" "}
              {V.tiktokOff ? (
                <React.Fragment>
                  <div style={st49}>
                    <span style={st50}>
                      {V.tiktokIcon}
                    </span>
                    <div style={st51}>
                      {"Ton compte TikTok Shop n'est pas connecté — les données affichées sont des estimations."}
                    </div>
                  </div>
                </React.Fragment>
              ) : null}
              <div style={st52}>
                {(V.dashKpis || []).map((k, _i8) => (
                  <React.Fragment key={_i8}>
                    <div style={st53}>
                      <div style={st54}>
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
                      <div style={st55}>
                        {k.label}
                      </div>
                      {V.dashPret ? (
                        <React.Fragment>
                          <div style={st56}>
                            {k.value}
                          </div>
                        </React.Fragment>
                      ) : null}
                      {" "}
                      {V.dashOccupe ? (
                        <React.Fragment>
                          <div className="sk" style={st57}></div>
                        </React.Fragment>
                      ) : null}
                      {" "}
                      {k.sub ? (
                        <React.Fragment>
                          <div style={st58}>
                            {k.sub}
                          </div>
                        </React.Fragment>
                      ) : null}
                    </div>
                  </React.Fragment>
                ))}
              </div>
              <div style={st59}>
                <div style={st60}>
                  <div style={st61}>
                    <div style={st62}>
                      {"Évolution CA & Commissions"}
                    </div>
                    <div style={st63}>
                      <span style={st64}>
                        <span style={st65}></span>
                        {"CA"}
                      </span>
                      {" "}
                      <span style={st64}>
                        <span style={st66}></span>
                        {"Commissions"}
                      </span>
                    </div>
                  </div>
                  {V.dashPret ? (
                    <React.Fragment>
                      {" "}{V.lineChart}{" "}
                    </React.Fragment>
                  ) : null}
                  {" "}
                  {V.dashOccupe ? (
                    <React.Fragment>
                      <div className="sk" style={st67}></div>
                    </React.Fragment>
                  ) : null}
                </div>
                <div style={st68}>
                  <div style={st61}>
                    <div style={st62}>
                      {"Top Produits"}
                    </div>
                    <div style={st69}>
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
                      <div style={st70}>
                        <div style={css(`width:26px;height:26px;flex:none;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:12.5px;font-weight:700;background:${t.rankBg ?? ""};color:${t.rankFg ?? ""};`)}>
                          {t.rank}
                        </div>
                        <div style={st16}>
                          <div style={st71} title={t.nameComplet}>
                            {t.name}
                          </div>
                          <div style={st72}>
                            {t.ventes}{" ventes"}
                          </div>
                        </div>
                        <div style={st73}>
                          {t.amount}
                        </div>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
              <div style={st74}>
                <div style={st75}>
                  <div style={st76}>
                    <div style={st77}>
                      <span style={st78}>
                        {V.videoIcon}
                      </span>
                      <div style={st62}>
                        {"Prêtes à poster"}
                      </div>
                    </div>
                    <div style={st79}>
                      {V.aPosterCount}
                    </div>
                  </div>
                  {(V.aPoster || []).map((v, _i9) => (
                    <React.Fragment key={_i9}>
                      <div style={st80}>
                        <div style={st81}>
                          <div style={st71} title={v.nomComplet}>
                            {v.nom}
                          </div>
                          <div style={st72}>
                            {v.quand}{" · "}{v.ext}
                          </div>
                        </div>
                        <div style={st82}>
                          {v.duree}
                        </div>
                      </div>
                    </React.Fragment>
                  ))}
                  {V.aPosterVide ? (
                    <React.Fragment>
                      <div style={st83}>
                        {"Aucune vidéo marquée « Prête à poster ». Change le statut d'une vidéo depuis la page Vidéos pour la voir arriver ici."}
                      </div>
                    </React.Fragment>
                  ) : null}
                </div>
                <div style={st75}>
                  <div style={st84}>
                    <span style={st85}>
                      {V.etoileIcon}
                    </span>
                    <div style={st62}>
                      {"Idées marquées"}
                    </div>
                  </div>
                  {(V.ideesMarquees || []).map((i, _i9) => (
                    <React.Fragment key={_i9}>
                      <div style={st86}>
                        <div style={st71} title={i.libelleComplet}>
                          {i.libelle}
                        </div>
                        <div style={st72}>
                          {i.quand}
                        </div>
                      </div>
                    </React.Fragment>
                  ))}
                  {V.ideesMarqueesVide ? (
                    <React.Fragment>
                      <div style={st83}>
                        {"Aucune idée marquée. Touche l'étoile sur une idée pour l'épingler ici."}
                      </div>
                    </React.Fragment>
                  ) : null}
                </div>
              </div>
            </div>
          </React.Fragment>
        ) : null}
        {V.isAnalytics ? (
          <React.Fragment>
            <div style={st87}>
              <div style={st88}>
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
                  <div style={st7}>
                    <div style={st89}>
                      {(V.compteKpis || []).map((k, _i11) => (
                        <React.Fragment key={_i11}>
                          <div style={st53}>
                            <div style={st54}>
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
                            <div style={st90}>
                              {k.label}
                            </div>
                            <div style={st91}>
                              {k.value}
                            </div>
                            {k.sub ? (
                              <React.Fragment>
                                <div style={st58}>
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
                        <div style={st92}>
                          <span style={st93}>
                            {V.alertIcon}
                          </span>
                          <div style={st94}>
                            <span style={st95}>
                              {V.eligPct}{" d'éligibilité"}
                            </span>
                            {" — "}{V.eligCount}{" commandes inéligibles sur la période."}
                          </div>
                        </div>
                      </React.Fragment>
                    ) : null}
                    <div style={st96}>
                      <div style={st60}>
                        <div style={st97}>
                          <div style={st62}>
                            {"Évolution CA & Commissions"}
                          </div>
                          <div style={st63}>
                            <span style={st64}>
                              <span style={st65}></span>
                              {"CA"}
                            </span>
                            {" "}
                            <span style={st64}>
                              <span style={st66}></span>
                              {"Commissions"}
                            </span>
                          </div>
                        </div>
                        {V.dashPret ? (
                          <React.Fragment>
                            {" "}{V.lineChart}{" "}
                          </React.Fragment>
                        ) : null}
                        {" "}
                        {V.dashOccupe ? (
                          <React.Fragment>
                            <div className="sk" style={st67}></div>
                          </React.Fragment>
                        ) : null}
                      </div>
                      <div style={st68}>
                        <div style={st98}>
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
                  <div style={st99}>
                    <table style={st100}>
                      <thead>
                        <tr style={st101}>
                          <th style={st102} onClick={V.marquesSort.name.onClick}>
                            <span style={css(`color:${V.marquesSort.name.color ?? ""}`)}>
                              {"Marque"}{V.marquesSort.name.arrow}
                            </span>
                          </th>
                          <th style={st103} onClick={V.marquesSort.orders.onClick}>
                            <span style={css(`color:${V.marquesSort.orders.color ?? ""}`)}>
                              {"Commandes"}{V.marquesSort.orders.arrow}
                            </span>
                          </th>
                          <th style={st103} onClick={V.marquesSort.ca.onClick}>
                            <span style={css(`color:${V.marquesSort.ca.color ?? ""}`)}>
                              {"CA"}{V.marquesSort.ca.arrow}
                            </span>
                          </th>
                          <th style={st103} onClick={V.marquesSort.com.onClick}>
                            <span style={css(`color:${V.marquesSort.com.color ?? ""}`)}>
                              {"Commissions"}{V.marquesSort.com.arrow}
                            </span>
                          </th>
                          <th style={st103} onClick={V.marquesSort.taux.onClick}>
                            <span style={css(`color:${V.marquesSort.taux.color ?? ""}`)}>
                              {"Taux"}{V.marquesSort.taux.arrow}
                            </span>
                          </th>
                          <th style={st103} onClick={V.marquesSort.panier.onClick}>
                            <span style={css(`color:${V.marquesSort.panier.color ?? ""}`)}>
                              {"Panier moyen"}{V.marquesSort.panier.arrow}
                            </span>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {(V.marquesRows || []).map((r, _i12) => (
                          <React.Fragment key={_i12}>
                            <tr style={st101} className={sp("hover", "background:var(--primary-softer)")}>
                              <td style={st104}>
                                {r.name}
                              </td>
                              <td style={st105}>
                                {r.orders}
                              </td>
                              <td style={st106}>
                                {r.ca}
                              </td>
                              <td style={st107}>
                                {r.com}
                              </td>
                              <td style={st108}>
                                <span style={css(`display:inline-block;padding:3px 9px;border-radius:999px;font-size:11.5px;font-weight:700;background:${r.tauxBg ?? ""};color:${r.tauxFg ?? ""};`)}>
                                  {r.tauxStr}
                                </span>
                              </td>
                              <td style={st105}>
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
                  <div style={st99}>
                    <table style={st100}>
                      <thead>
                        <tr style={st101}>
                          <th style={st102} onClick={V.produitsSort.name.onClick}>
                            <span style={css(`color:${V.produitsSort.name.color ?? ""}`)}>
                              {"Produit"}{V.produitsSort.name.arrow}
                            </span>
                          </th>
                          <th style={st102} onClick={V.produitsSort.boutique.onClick}>
                            <span style={css(`color:${V.produitsSort.boutique.color ?? ""}`)}>
                              {"Boutique"}{V.produitsSort.boutique.arrow}
                            </span>
                          </th>
                          <th style={st103} onClick={V.produitsSort.orders.onClick}>
                            <span style={css(`color:${V.produitsSort.orders.color ?? ""}`)}>
                              {"Commandes"}{V.produitsSort.orders.arrow}
                            </span>
                          </th>
                          <th style={st103} onClick={V.produitsSort.ca.onClick}>
                            <span style={css(`color:${V.produitsSort.ca.color ?? ""}`)}>
                              {"CA"}{V.produitsSort.ca.arrow}
                            </span>
                          </th>
                          <th style={st103} onClick={V.produitsSort.com.onClick}>
                            <span style={css(`color:${V.produitsSort.com.color ?? ""}`)}>
                              {"Commissions"}{V.produitsSort.com.arrow}
                            </span>
                          </th>
                          <th style={st103} onClick={V.produitsSort.taux.onClick}>
                            <span style={css(`color:${V.produitsSort.taux.color ?? ""}`)}>
                              {"Taux"}{V.produitsSort.taux.arrow}
                            </span>
                          </th>
                          <th style={st103} onClick={V.produitsSort.panier.onClick}>
                            <span style={css(`color:${V.produitsSort.panier.color ?? ""}`)}>
                              {"Panier moyen"}{V.produitsSort.panier.arrow}
                            </span>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {(V.produitsRows || []).map((r, _i12) => (
                          <React.Fragment key={_i12}>
                            <tr style={st101} className={sp("hover", "background:var(--primary-softer)")}>
                              <td style={st104}>
                                {r.name}
                              </td>
                              <td style={st109}>
                                {r.boutique}
                              </td>
                              <td style={st105}>
                                {r.orders}
                              </td>
                              <td style={st106}>
                                {r.ca}
                              </td>
                              <td style={st107}>
                                {r.com}
                              </td>
                              <td style={st108}>
                                <span style={css(`display:inline-block;padding:3px 9px;border-radius:999px;font-size:11.5px;font-weight:700;background:${r.tauxBg ?? ""};color:${r.tauxFg ?? ""};`)}>
                                  {r.tauxStr}
                                </span>
                              </td>
                              <td style={st105}>
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
                  <div style={st99}>
                    {V.bibliotheque.visible ? (
                      <React.Fragment>
                        <div style={css(`padding:12px 16px;border-radius:13px;background:${V.bibliotheque.bg ?? ""};color:${V.bibliotheque.fg ?? ""};font-size:13px;font-weight:600;`)}>
                          {V.bibliotheque.texte}
                        </div>
                      </React.Fragment>
                    ) : null}
                    <table style={st100}>
                      <thead>
                        <tr style={st101}>
                          <th style={st102} onClick={V.videosSort.titre.onClick}>
                            <span style={css(`color:${V.videosSort.titre.color ?? ""}`)}>
                              {"Vidéo"}{V.videosSort.titre.arrow}
                            </span>
                          </th>
                          <th style={st102} onClick={V.videosSort.produit.onClick}>
                            <span style={css(`color:${V.videosSort.produit.color ?? ""}`)}>
                              {"Produit"}{V.videosSort.produit.arrow}
                            </span>
                          </th>
                          <th style={st103} onClick={V.videosSort.vues.onClick}>
                            <span style={css(`color:${V.videosSort.vues.color ?? ""}`)}>
                              {"Vues"}{V.videosSort.vues.arrow}
                            </span>
                          </th>
                          <th style={st103} onClick={V.videosSort.orders.onClick}>
                            <span style={css(`color:${V.videosSort.orders.color ?? ""}`)}>
                              {"Commandes"}{V.videosSort.orders.arrow}
                            </span>
                          </th>
                          <th style={st103} onClick={V.videosSort.ca.onClick}>
                            <span style={css(`color:${V.videosSort.ca.color ?? ""}`)}>
                              {"CA"}{V.videosSort.ca.arrow}
                            </span>
                          </th>
                          <th style={st103} onClick={V.videosSort.com.onClick}>
                            <span style={css(`color:${V.videosSort.com.color ?? ""}`)}>
                              {"Commissions"}{V.videosSort.com.arrow}
                            </span>
                          </th>
                          <th style={st103} onClick={V.videosSort.conv.onClick}>
                            <span style={css(`color:${V.videosSort.conv.color ?? ""}`)}>
                              {"Conversion"}{V.videosSort.conv.arrow}
                            </span>
                          </th>
                          <th style={st103} onClick={V.videosSort.revvue.onClick}>
                            <span style={css(`color:${V.videosSort.revvue.color ?? ""}`)}>
                              {"€ / vue"}{V.videosSort.revvue.arrow}
                            </span>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {(V.videosRows || []).map((r, _i12) => (
                          <React.Fragment key={_i12}>
                            <tr style={st101} className={sp("hover", "background:var(--primary-softer)")}>
                              <td style={st104}>
                                {r.titre}
                              </td>
                              <td style={st109}>
                                {r.produit}
                              </td>
                              <td style={st105}>
                                {r.vues}
                              </td>
                              <td style={st105}>
                                {r.orders}
                              </td>
                              <td style={st106}>
                                {r.ca}
                              </td>
                              <td style={st107}>
                                {r.com}
                              </td>
                              <td style={st108}>
                                <span style={css(`display:inline-block;padding:3px 9px;border-radius:999px;font-size:11.5px;font-weight:700;background:${r.convBg ?? ""};color:${r.convFg ?? ""};`)}>
                                  {r.convStr}
                                </span>
                              </td>
                              <td style={st105}>
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
            <div onClick={V.closeProspectForm} style={st110}>
              <div onClick={V.stopProp} style={st111}>
                <div style={st112}>
                  {"Nouveau partenaire à prospecter"}
                </div>
                <div style={st113}>
                  <label style={st114}>
                    {"Nom du partenaire"}
                  </label>
                  <input value={V.prospectForm.name ?? ""} onChange={V.prospectForm.onName} placeholder="Ex. Bloom Cosmétiques" style={st115} />
                </div>
                <div style={st113}>
                  <label style={st114}>
                    {"Email de contact"}
                  </label>
                  <input value={V.prospectForm.contact ?? ""} onChange={V.prospectForm.onContact} placeholder="contact@marque.com" style={st115} />
                </div>
                <div style={st116}>
                  <button onClick={V.closeProspectForm} style={st117}>
                    {"Annuler"}
                  </button>
                  <button onClick={V.submitProspect} style={st118} className={sp("hover", "background:var(--primary-2)")}>
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
            <div onClick={V.closeThread} style={st119}>
              <div onClick={V.stopProp} style={st120}>
                <div style={st121}>
                  <div style={st122}>
                    {V.threadInitial}
                  </div>
                  <div style={st16}>
                    <div style={st123}>
                      {V.threadName}
                    </div>
                    <div style={st72}>
                      {V.threadContact}
                    </div>
                  </div>
                  <button onClick={V.closeThread} style={st124}>
                    {"×"}
                  </button>
                </div>
                <div style={st125}>
                  {(V.threadMessages || []).map((m, _i9) => (
                    <React.Fragment key={_i9}>
                      <div style={css(`display:flex;flex-direction:column;align-items:${m.align ?? ""};`)}>
                        <div style={css(`max-width:82%;background:${m.bg ?? ""};color:${m.fg ?? ""};border-radius:${m.radius ?? ""};padding:12px 14px;box-shadow:0 1px 6px rgba(30,20,60,0.05);${m.border ?? ""}`)}>
                          <div style={st126}>
                            <span style={st127}>
                              {m.who}
                            </span>
                            {" "}
                            <span style={st128}>
                              {m.date}
                            </span>
                          </div>
                          <div style={st129}>
                            {m.subject}
                          </div>
                          <div style={st130}>
                            {m.body}
                          </div>
                        </div>
                      </div>
                    </React.Fragment>
                  ))}
                  {V.threadEmpty ? (
                    <React.Fragment>
                      <div style={st131}>
                        <div style={st132}>
                          {V.mailIcon}
                        </div>
                        <div style={st133}>
                          {"Aucun échange pour l'instant — envoie le premier email ci-dessous."}
                        </div>
                      </div>
                    </React.Fragment>
                  ) : null}
                </div>
                <div style={st134}>
                  <input value={V.threadReply.subject ?? ""} onChange={V.threadReply.onSubject} placeholder="Objet" style={st135} />
                  <div style={st136}>
                    <textarea value={V.threadReply.body ?? ""} onChange={V.threadReply.onBody} placeholder="Écris ton email…" style={st137}></textarea>
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
            <div style={st138}>
              {V.idees.visible ? (
                <React.Fragment>
                  <div style={css(`padding:12px 16px;border-radius:13px;background:${V.idees.bg ?? ""};color:${V.idees.fg ?? ""};font-size:13px;font-weight:600;`)}>
                    {V.idees.texte}
                  </div>
                </React.Fragment>
              ) : null}
              <div style={css(`background:var(--card);border:2px dashed ${V.composerBorder ?? ""};border-radius:20px;padding:18px;box-shadow:0 1px 8px rgba(30,20,60,0.04);transition:border-color .15s;`)} onDragOver={V.onDragOver} onDragLeave={V.onDragLeave} onDrop={V.onDrop}>
                <textarea value={V.composerText ?? ""} onChange={V.onComposerChange} placeholder="Écris une idée, colle un lien, ou glisse une vidéo ici…" style={st139}></textarea>
                {V.aiProcessing ? (
                  <React.Fragment>
                    <div style={st140}>
                      <span style={st141}></span>
                      {" L'IA reformule ta dictée en script… "}
                    </div>
                  </React.Fragment>
                ) : null}
                <div style={st142}>
                  <div style={st143}>
                    <input type="file" accept="video/*" ref={V.fileInputRef} onChange={V.onFilePicked} style={st47} />
                    <button onClick={V.onBrowseClick} style={st144} className={sp("hover", "border-color:var(--primary);color:var(--primary-2)")}>
                      {V.clipIcon}{"Vidéo"}
                    </button>
                    {V.isRecording ? (
                      <React.Fragment>
                        <div style={st145}>
                          <span style={st146}></span>
                          {"Écoute…"}
                        </div>
                      </React.Fragment>
                    ) : null}
                    {" "}
                    {V.micError ? (
                      <React.Fragment>
                        <div style={st147}>
                          {V.micError}
                        </div>
                      </React.Fragment>
                    ) : null}
                  </div>
                  <div style={st148}>
                    {V.speechSupported ? (
                      <React.Fragment>
                        <button onClick={V.toggleDictation} style={css(`display:flex;align-items:center;gap:6px;padding:9px 13px;border:1px solid ${V.micBorder ?? ""};background:${V.micBg ?? ""};color:${V.micFg ?? ""};border-radius:11px;font-size:13px;font-weight:600;cursor:pointer;`)}>
                          {V.micIcon}{V.micLabel}
                        </button>
                      </React.Fragment>
                    ) : null}
                    <button onClick={V.addIdea} style={st149} className={sp("hover", "background:var(--primary-2)")}>
                      {V.plusIcon}{"Ajouter"}
                    </button>
                  </div>
                </div>
              </div>
              <div style={st150}>
                <div style={st151}>
                  {V.ideaCount}{" idées"}
                </div>
                <div style={st69}>
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
                  <div style={st152}>
                    {(V.ideaCards || []).map((c, _i10) => (
                      <React.Fragment key={_i10}>
                        <div style={css(`break-inside:avoid;margin-bottom:16px;background:${c.bg ?? ""};border-radius:16px;padding:16px;position:relative;box-shadow:0 1px 6px rgba(30,20,60,0.05);`)}>
                          <div style={st153}>
                            <button onClick={c.onPin} style={css(`width:24px;height:24px;border:none;border-radius:50%;background:${c.pinBg ?? ""};color:${c.pinFg ?? ""};cursor:pointer;display:flex;align-items:center;justify-content:center;`)}>
                              {V.pinIcon}
                            </button>
                            <button onClick={c.onRemove} style={st154}>
                              {"×"}
                            </button>
                          </div>
                          {c.isText ? (
                            <React.Fragment>
                              <div style={st155}>
                                {c.text}
                              </div>
                            </React.Fragment>
                          ) : null}
                          {" "}
                          {c.isLink ? (
                            <React.Fragment>
                              <a href={c.url} target="_blank" rel="noopener" style={st156}>
                                <div style={st157}>
                                  {V.linkIcon}
                                </div>
                                <div style={st158}>
                                  {c.domain}
                                </div>
                                <div style={st159}>
                                  {c.url}
                                </div>
                              </a>
                            </React.Fragment>
                          ) : null}
                          {" "}
                          {c.isVideo ? (
                            <React.Fragment>
                              <div style={st160}>
                                <video src={c.videoUrl} controls={true} preload="metadata" style={st161}></video>
                                <div style={st162}>
                                  {c.videoName}
                                </div>
                                <div style={css(`display:inline-flex;align-self:flex-start;align-items:center;gap:5px;padding:3px 9px;border-radius:999px;font-size:11px;font-weight:700;background:${c.storeBg ?? ""};color:${c.storeFg ?? ""};`)}>
                                  {c.storeIcon}{c.storeLabel}
                                </div>
                              </div>
                            </React.Fragment>
                          ) : null}
                          <div style={st163}>
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
                  <div style={st164}>
                    {(V.ideaCards || []).map((c, _i10) => (
                      <React.Fragment key={_i10}>
                        <div style={css(`background:${c.bg ?? ""};border-radius:16px;padding:16px;position:relative;box-shadow:0 1px 6px rgba(30,20,60,0.05);`)}>
                          <div style={st153}>
                            <button onClick={c.onPin} style={css(`width:24px;height:24px;border:none;border-radius:50%;background:${c.pinBg ?? ""};color:${c.pinFg ?? ""};cursor:pointer;display:flex;align-items:center;justify-content:center;`)}>
                              {V.pinIcon}
                            </button>
                            <button onClick={c.onRemove} style={st154}>
                              {"×"}
                            </button>
                          </div>
                          {c.isText ? (
                            <React.Fragment>
                              <div style={st165}>
                                {c.text}
                              </div>
                            </React.Fragment>
                          ) : null}
                          {" "}
                          {c.isLink ? (
                            <React.Fragment>
                              <a href={c.url} target="_blank" rel="noopener" style={st166}>
                                <div style={st167}>
                                  {V.linkIcon}
                                </div>
                                <div style={st81}>
                                  <div style={st168}>
                                    {c.domain}
                                  </div>
                                  <div style={st159}>
                                    {c.url}
                                  </div>
                                </div>
                              </a>
                            </React.Fragment>
                          ) : null}
                          {" "}
                          {c.isVideo ? (
                            <React.Fragment>
                              <div style={st169}>
                                <video src={c.videoUrl} controls={true} preload="metadata" style={st170}></video>
                                <div style={st81}>
                                  <div style={st171}>
                                    {c.videoName}
                                  </div>
                                  <div style={css(`display:inline-flex;align-items:center;gap:5px;padding:3px 9px;border-radius:999px;font-size:11px;font-weight:700;background:${c.storeBg ?? ""};color:${c.storeFg ?? ""};margin-top:6px;`)}>
                                    {c.storeIcon}{c.storeLabel}
                                  </div>
                                </div>
                              </div>
                            </React.Fragment>
                          ) : null}
                          <div style={st163}>
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
                  <div style={st172}>
                    <div style={st173}>
                      {V.bulbIcon}
                    </div>
                    <div style={st174}>
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
            <div style={st48}>
              {V.importCommandes.visible ? (
                <React.Fragment>
                  <div style={css(`padding:12px 16px;border-radius:13px;background:${V.importCommandes.bg ?? ""};color:${V.importCommandes.fg ?? ""};font-size:13px;font-weight:600;`)}>
                    {V.importCommandes.texte}
                  </div>
                </React.Fragment>
              ) : null}
              <div style={st89}>
                {(V.ordersKpis || []).map((k, _i8) => (
                  <React.Fragment key={_i8}>
                    <div style={st53}>
                      <div style={st175}>
                        {k.label}
                      </div>
                      <div style={st176}>
                        {k.value}
                      </div>
                    </div>
                  </React.Fragment>
                ))}
              </div>
              <div style={st99}>
                <table style={st100}>
                  <thead>
                    <tr style={st101}>
                      <th style={st102} onClick={V.cmdSort.dateKey.onClick}>
                        <span style={css(`color:${V.cmdSort.dateKey.color ?? ""}`)}>
                          {"Date"}{V.cmdSort.dateKey.arrow}
                        </span>
                      </th>
                      <th style={st102} onClick={V.cmdSort.produit.onClick}>
                        <span style={css(`color:${V.cmdSort.produit.color ?? ""}`)}>
                          {"Produit"}{V.cmdSort.produit.arrow}
                        </span>
                      </th>
                      <th style={st102} onClick={V.cmdSort.vendeur.onClick}>
                        <span style={css(`color:${V.cmdSort.vendeur.color ?? ""}`)}>
                          {"Vendeur"}{V.cmdSort.vendeur.arrow}
                        </span>
                      </th>
                      <th style={st102} onClick={V.cmdSort.statut.onClick}>
                        <span style={css(`color:${V.cmdSort.statut.color ?? ""}`)}>
                          {"Statut"}{V.cmdSort.statut.arrow}
                        </span>
                      </th>
                      <th style={st103} onClick={V.cmdSort.gmv.onClick}>
                        <span style={css(`color:${V.cmdSort.gmv.color ?? ""}`)}>
                          {"GMV"}{V.cmdSort.gmv.arrow}
                        </span>
                      </th>
                      <th style={st103} onClick={V.cmdSort.com.onClick}>
                        <span style={css(`color:${V.cmdSort.com.color ?? ""}`)}>
                          {"Commission"}{V.cmdSort.com.arrow}
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {(V.commandesRows || []).map((r, _i10) => (
                      <React.Fragment key={_i10}>
                        <tr style={st101} className={sp("hover", "background:var(--primary-softer)")}>
                          <td style={st177}>
                            {r.date}
                          </td>
                          <td style={st104} title={r.produitComplet}>
                            {r.produit}
                          </td>
                          <td style={st109}>
                            {r.vendeur}
                          </td>
                          <td style={st178}>
                            <span style={css(`display:inline-block;padding:4px 10px;border-radius:999px;font-size:11.5px;font-weight:700;background:${r.statutBg ?? ""};color:${r.statutFg ?? ""};`)}>
                              {r.statut}
                            </span>
                          </td>
                          <td style={st106}>
                            {r.gmv}
                          </td>
                          <td style={st107}>
                            {r.com}
                          </td>
                        </tr>
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
                {V.chargementCommandes ? (
                  <React.Fragment>
                    <div style={st179}>
                      {(V.squelettes || []).map((sq, _i11) => (
                        <React.Fragment key={_i11}>
                          <div className="sk" style={css(`height:17px;width:${sq.largeur ?? ""};`)}></div>
                        </React.Fragment>
                      ))}
                    </div>
                  </React.Fragment>
                ) : null}
                {" "}
                {V.noCommandes ? (
                  <React.Fragment>
                    <div style={st180}>
                      {V.messageVide}
                    </div>
                  </React.Fragment>
                ) : null}
                {" "}
                {V.pagination.visible ? (
                  <React.Fragment>
                    <div style={st181}>
                      <div style={st79}>
                        {V.pagination.resume}
                      </div>
                      <div style={st143}>
                        <button onClick={V.pagination.prec} style={css(`padding:7px 13px;border:1px solid var(--border-2);border-radius:9px;background:var(--card);color:var(--text-2);font-size:12.5px;font-weight:600;cursor:pointer;opacity:${V.pagination.precOp ?? ""};pointer-events:${V.pagination.precPe ?? ""};`)} className={sp("hover", "background:var(--primary-softer)")}>
                          {"Précédent"}
                        </button>
                        <div style={st182}>
                          {V.pagination.page}
                        </div>
                        <button onClick={V.pagination.suiv} style={css(`padding:7px 13px;border:1px solid var(--border-2);border-radius:9px;background:var(--card);color:var(--text-2);font-size:12.5px;font-weight:600;cursor:pointer;opacity:${V.pagination.suivOp ?? ""};pointer-events:${V.pagination.suivPe ?? ""};`)} className={sp("hover", "background:var(--primary-softer)")}>
                          {"Suivant"}
                        </button>
                      </div>
                    </div>
                  </React.Fragment>
                ) : null}
              </div>
            </div>
          </React.Fragment>
        ) : null}
        {" "}
        {V.isRushs ? (
          <React.Fragment>
            <div style={st183}>
              {V.bibliotheque.visible ? (
                <React.Fragment>
                  <div style={css(`padding:12px 16px;border-radius:13px;background:${V.bibliotheque.bg ?? ""};color:${V.bibliotheque.fg ?? ""};font-size:13px;font-weight:600;`)}>
                    {V.bibliotheque.texte}
                  </div>
                </React.Fragment>
              ) : null}
              <div style={st184}>
                <div style={st185}>
                  <button onClick={V.rushGoRoot} style={css(`border:none;background:transparent;padding:4px 6px;border-radius:8px;font-family:inherit;font-size:13.5px;font-weight:700;color:${V.rushRootFg ?? ""};cursor:pointer;`)} className={sp("hover", "background:var(--primary-softer)")}>
                    {"Tous les rushs"}
                  </button>
                  {V.rushInFolder ? (
                    <React.Fragment>
                      <span style={st27}>
                        {V.chevronRIcon}
                      </span>
                      {" "}
                      <span style={st186}>
                        {V.rushFolderName}
                      </span>
                    </React.Fragment>
                  ) : null}
                </div>
                <div style={st11}></div>
                <input value={V.rushQuery ?? ""} onChange={V.onRushQuery} placeholder="Rechercher un rush…" style={st187} />
                <button onClick={V.rushNewFolder} style={st188} className={sp("hover", "background:var(--primary-softer)")}>
                  {V.folderPlusIcon}
                  <span>
                    {"Nouveau dossier"}
                  </span>
                </button>
                <input type="file" accept="video/*" multiple="" ref={V.rushInputRef} onChange={V.onRushPick} style={st47} />
                <button onClick={V.rushBrowse} style={st189}>
                  {V.uploadIcon}
                  <span>
                    {"Importer"}
                  </span>
                </button>
                <div style={st190}>
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
                    <div style={st191}>
                      {(V.rushCards || []).map((r, _i11) => (
                        <React.Fragment key={_i11}>
                          <div draggable={r.draggable} onDragStart={r.onDragStart} onDragOver={r.onDragOver} onDragLeave={r.onDragLeave} onDrop={r.onDrop} onDoubleClick={r.onOpen} style={css(`position:relative;background:var(--card);border:1.5px solid ${r.border ?? ""};border-radius:16px;padding:12px;display:flex;flex-direction:column;gap:10px;cursor:pointer;box-shadow:0 1px 8px rgba(30,20,60,0.04);transition:border-color .15s,transform .12s;`)} className={sp("hover", "transform:translateY(-2px)")}>
                            <div onClick={r.onOpen} style={css(`height:112px;border-radius:11px;overflow:hidden;background:${r.thumbBg ?? ""};display:flex;align-items:center;justify-content:center;color:${r.thumbFg ?? ""};`)}>
                              {" "}{r.thumb}{" "}
                            </div>
                            <div>
                              <div style={st192}>
                                {r.name}
                              </div>
                              <div style={st193}>
                                {r.meta}
                              </div>
                            </div>
                            <div style={st194}>
                              <button onClick={r.onRename} title="Renommer" style={st195} className={sp("hover", "background:var(--primary-softer)")}>
                                {V.penIcon}
                              </button>
                              <button onClick={r.onDelete} title="Supprimer" style={st196} className={sp("hover", "background:var(--neg-soft);color:var(--neg)")}>
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
                    <div style={st197}>
                      {(V.rushCards || []).map((r, _i11) => (
                        <React.Fragment key={_i11}>
                          <div draggable={r.draggable} onDragStart={r.onDragStart} onDragOver={r.onDragOver} onDragLeave={r.onDragLeave} onDrop={r.onDrop} onDoubleClick={r.onOpen} style={css(`display:flex;align-items:center;gap:14px;padding:11px 15px;border-bottom:1px solid var(--border);border-left:3px solid ${r.rowAccent ?? ""};cursor:pointer;`)} className={sp("hover", "background:var(--primary-softer)")}>
                            <div onClick={r.onOpen} style={css(`width:34px;height:34px;flex:none;border-radius:10px;background:${r.thumbBg ?? ""};color:${r.thumbFg ?? ""};display:flex;align-items:center;justify-content:center;`)}>
                              {r.smallIcon}
                            </div>
                            <div style={st16}>
                              <div style={st71}>
                                {r.name}
                              </div>
                            </div>
                            <div style={st198}>
                              {r.meta}
                            </div>
                            <button onClick={r.onRename} style={st199}>
                              {V.penIcon}
                            </button>
                            <button onClick={r.onDelete} style={st200} className={sp("hover", "background:var(--neg-soft);color:var(--neg)")}>
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
                    <div style={st201}>
                      <div style={st202}>
                        {V.uploadBigIcon}
                      </div>
                      <div style={st203}>
                        {"Glisse tes rushs ici"}
                      </div>
                      <div style={st204}>
                        {"MP4, MOV, AVI, MKV, WebM — tous formats acceptés. Crée des dossiers pour trier par produit ou par marque."}
                      </div>
                    </div>
                  </React.Fragment>
                ) : null}
              </div>
              <div style={st205}>
                {"Astuce : glisse un rush sur un dossier pour le ranger. Double-clic pour ouvrir."}
              </div>
            </div>
            {V.rushRenameOpen ? (
              <React.Fragment>
                <div onClick={V.rushRenameClose} style={st110}>
                  <div onClick={V.stopProp} style={st206}>
                    <div style={st112}>
                      {"Renommer"}
                    </div>
                    <input value={V.rushRenameVal ?? ""} onChange={V.onRushRenameVal} onKeyDown={V.onRushRenameKey} style={st207} />
                    <div style={st208}>
                      <button onClick={V.rushRenameClose} style={st209}>
                        {"Annuler"}
                      </button>
                      <button onClick={V.rushRenameSave} style={st210}>
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
                <div onClick={V.rushPreviewClose} style={st211}>
                  <div onClick={V.stopProp} style={st212}>
                    <div style={st213}>
                      {V.rushPreviewMedia}
                    </div>
                    <div style={st214}>
                      <div style={st16}>
                        <div style={st215}>
                          {V.rushPreviewName}
                        </div>
                        <div style={st216}>
                          {V.rushPreviewMeta}
                        </div>
                      </div>
                      <button onClick={V.rushPreviewRename} style={st217}>
                        {"Renommer"}
                      </button>
                      <button onClick={V.rushPreviewClose} style={st218}>
                        {"Fermer"}
                      </button>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            ) : null}
          </React.Fragment>
        ) : null}
        {V.isParametres ? (
          <React.Fragment>
            <div style={st219}>
              <div style={st220}>
                <div style={st221}>
                  <div style={st222}>
                    <div style={st62}>
                      {"Profil"}
                    </div>
                    {V.profil.visible ? (
                      <React.Fragment>
                        <div style={css(`padding:10px 13px;border-radius:11px;background:${V.profil.bg ?? ""};color:${V.profil.fg ?? ""};font-size:12.5px;font-weight:600;`)}>
                          {V.profil.texte}
                        </div>
                      </React.Fragment>
                    ) : null}
                    <div style={st223}>
                      {V.hasAvatar ? (
                        <React.Fragment>
                          {" "}{V.avatarImg}{" "}
                        </React.Fragment>
                      ) : null}
                      {" "}
                      {V.noAvatar ? (
                        <React.Fragment>
                          <div style={st224}>
                            {V.avatarInitials}
                          </div>
                        </React.Fragment>
                      ) : null}
                      <div style={st225}>
                        <div style={st226}>
                          {"JPG ou PNG, 400×400 px minimum."}
                        </div>
                        <div style={st148}>
                          <input type="file" accept="image/*" ref={V.avatarInputRef} onChange={V.onAvatarPick} style={st47} />
                          <button onClick={V.onAvatarBrowse} style={st210} className={sp("hover", "background:var(--primary-2)")}>
                            {"Changer la photo"}
                          </button>
                          {V.hasAvatar ? (
                            <React.Fragment>
                              <button onClick={V.onAvatarRemove} style={st209} className={sp("hover", "border-color:var(--neg);color:var(--neg)")}>
                                {"Retirer"}
                              </button>
                            </React.Fragment>
                          ) : null}
                        </div>
                      </div>
                    </div>
                    <div style={st227}>
                      <div style={st228}>
                        <label style={st229}>
                          {"Nom complet"}
                        </label>
                        <input value={V.profileName ?? ""} onChange={V.onProfileName} style={st230} />
                      </div>
                      <div style={st228}>
                        <label style={st229}>
                          {"Pseudo TikTok"}
                        </label>
                        <input value={V.profileHandle ?? ""} onChange={V.onProfileHandle} style={st230} />
                      </div>
                      <div style={st228}>
                        <label style={st229}>
                          {"Email"}
                        </label>
                        <div style={st231}>
                          {V.profileEmail}
                        </div>
                        <div style={st232}>
                          {"Adresse de connexion — elle ne se modifie pas ici."}
                        </div>
                      </div>
                      <div style={st228}>
                        <label style={st229}>
                          {"Téléphone"}
                        </label>
                        <input value={V.profilePhone ?? ""} onChange={V.onProfilePhone} style={st230} />
                      </div>
                    </div>
                    <div style={st233}>
                      <button onClick={V.saveProfile} style={st234} className={sp("hover", "background:var(--primary-2)")}>
                        {"Enregistrer"}
                      </button>
                      {V.profileSaved ? (
                        <React.Fragment>
                          <div style={st235}>
                            {"Modifications enregistrées."}
                          </div>
                        </React.Fragment>
                      ) : null}
                    </div>
                  </div>
                  <div style={st236}>
                    <div>
                      <div style={st62}>
                        {"Connexion TikTok Shop"}
                      </div>
                      <div style={st237}>
                        {"Synchronise tes commandes, produits et commissions automatiquement."}
                      </div>
                    </div>
                    {V.tiktokConnected ? (
                      <React.Fragment>
                        <div style={st238}>
                          {"Connecté"}
                        </div>
                      </React.Fragment>
                    ) : null}
                    {" "}
                    {V.tiktokOff ? (
                      <React.Fragment>
                        <button style={st239} className={sp("hover", "background:var(--primary-2)")}>
                          {"Connecter"}
                        </button>
                      </React.Fragment>
                    ) : null}
                  </div>
                </div>
                <div style={st221}>
                  <div style={st240}>
                    <div>
                      <div style={st62}>
                        {"Mot de passe"}
                      </div>
                      <div style={st237}>
                        {"8 caractères minimum, avec une majuscule et un chiffre."}
                      </div>
                    </div>
                    <div style={st227}>
                      <div style={st241}>
                        <label style={st229}>
                          {"Mot de passe actuel"}
                        </label>
                        <input type="password" value={V.pwdCurrent ?? ""} onChange={V.onPwdCurrent} placeholder="••••••••" style={st242} />
                      </div>
                      <div style={st228}>
                        <label style={st229}>
                          {"Nouveau mot de passe"}
                        </label>
                        <input type="password" value={V.pwdNext ?? ""} onChange={V.onPwdNext} placeholder="••••••••" style={st242} />
                      </div>
                      <div style={st228}>
                        <label style={st229}>
                          {"Confirmation"}
                        </label>
                        <input type="password" value={V.pwdConfirm ?? ""} onChange={V.onPwdConfirm} placeholder="••••••••" style={st242} />
                      </div>
                    </div>
                    {V.showPwdMeter ? (
                      <React.Fragment>
                        <div style={st243}>
                          <div style={st244}>
                            <div style={css(`height:100%;border-radius:999px;width:${V.pwdBarWidth ?? ""};background:${V.pwdBarColor ?? ""};transition:width .18s ease;`)}></div>
                          </div>
                          <div style={css(`font-size:12px;font-weight:700;color:${V.pwdBarColor ?? ""};min-width:64px;`)}>
                            {V.pwdLevel}
                          </div>
                        </div>
                      </React.Fragment>
                    ) : null}
                    <div style={st233}>
                      <button onClick={V.submitPwd} style={st234} className={sp("hover", "background:var(--primary-2)")}>
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
                  <div style={st245}>
                    <div style={st246}>
                      <div style={st247}>
                        {"Notifications"}
                      </div>
                      <span style={st248}>
                        {"En développement"}
                      </span>
                    </div>
                    {(V.notifRows || []).map((n, _i10) => (
                      <React.Fragment key={_i10}>
                        <div style={st249}>
                          <div>
                            <div style={st250}>
                              {n.label}
                            </div>
                            <div style={st251}>
                              {n.sub}
                            </div>
                          </div>
                          <div style={st252}>
                            <span style={st253}></span>
                          </div>
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
              <div style={st254}>
                <div style={st255}>
                  {"Zone sensible"}
                </div>
                <div style={st256}></div>
              </div>
              <div style={st257}>
                <div>
                  <div style={st143}>
                    <div style={st247}>
                      {"Supprimer le compte"}
                    </div>
                    <span style={st248}>
                      {"En développement"}
                    </span>
                  </div>
                  <div style={st258}>
                    {"La suppression définitive n'est pas encore en place. Demande-la et elle sera faite à la main."}
                  </div>
                </div>
                <button disabled={V.vrai} style={st259}>
                  {"Supprimer"}
                </button>
              </div>
            </div>
          </React.Fragment>
        ) : null}
        {V.isVideosPage ? (
          <React.Fragment>
            <div style={st183}>
              <div style={st184}>
                <div style={st185}>
                  <button onClick={V.vidGoRoot} style={css(`border:none;background:transparent;padding:4px 6px;border-radius:8px;font-family:inherit;font-size:13.5px;font-weight:700;color:${V.vidRootFg ?? ""};cursor:pointer;`)} className={sp("hover", "background:var(--primary-softer)")}>
                    {"Toutes les vidéos"}
                  </button>
                  {V.vidInFolder ? (
                    <React.Fragment>
                      <span style={st27}>
                        {V.chevronRIcon}
                      </span>
                      {" "}
                      <span style={st186}>
                        {V.vidFolderName}
                      </span>
                    </React.Fragment>
                  ) : null}
                </div>
                <div style={st11}></div>
                <input value={V.vidQuery ?? ""} onChange={V.onVidQuery} placeholder="Rechercher une vidéo…" style={st260} />
                <button onClick={V.vidNewFolder} style={st188} className={sp("hover", "background:var(--primary-softer)")}>
                  {V.folderPlusIcon}
                  <span>
                    {"Nouveau dossier"}
                  </span>
                </button>
                <input type="file" accept="video/*" multiple="" ref={V.vidInputRef} onChange={V.onVidPick} style={st47} />
                <button onClick={V.vidBrowse} style={st189}>
                  {V.uploadIcon}
                  <span>
                    {"Importer"}
                  </span>
                </button>
                <div style={st190}>
                  <button onClick={V.vidGridBtn.onClick} style={css(`padding:7px 10px;border:none;border-radius:9px;background:${V.vidGridBtn.bg ?? ""};color:${V.vidGridBtn.fg ?? ""};cursor:pointer;display:flex;`)}>
                    {V.gridIcon}
                  </button>
                  <button onClick={V.vidListBtn.onClick} style={css(`padding:7px 10px;border:none;border-radius:9px;background:${V.vidListBtn.bg ?? ""};color:${V.vidListBtn.fg ?? ""};cursor:pointer;display:flex;`)}>
                    {V.listIcon}
                  </button>
                </div>
              </div>
              <div style={st261}>
                {(V.vidFilters || []).map((f, _i8) => (
                  <React.Fragment key={_i8}>
                    <button onClick={f.onClick} style={css(`display:flex;align-items:center;gap:7px;padding:7px 13px;border:1px solid ${f.border ?? ""};border-radius:999px;background:${f.bg ?? ""};color:${f.fg ?? ""};font-size:12.5px;font-weight:600;font-family:inherit;cursor:pointer;`)}>
                      <span>
                        {f.label}
                      </span>
                      {" "}
                      <span style={st262}>
                        {f.count}
                      </span>
                    </button>
                  </React.Fragment>
                ))}
              </div>
              <div onDragOver={V.onVidDragOver} onDragLeave={V.onVidDragLeave} onDrop={V.onVidDrop} style={css(`border:2px dashed ${V.vidDropBorder ?? ""};background:${V.vidDropBg ?? ""};border-radius:20px;padding:18px;transition:background .15s,border-color .15s;min-height:340px;`)}>
                {V.vidIsGrid ? (
                  <React.Fragment>
                    <div style={st263}>
                      {(V.vidCards || []).map((r, _i11) => (
                        <React.Fragment key={_i11}>
                          <div draggable={r.draggable} onDragStart={r.onDragStart} onDragOver={r.onDragOver} onDragLeave={r.onDragLeave} onDrop={r.onDrop} onDoubleClick={r.onOpen} style={css(`position:relative;background:var(--card);border:1.5px solid ${r.border ?? ""};border-radius:16px;padding:12px;display:flex;flex-direction:column;gap:10px;cursor:pointer;box-shadow:0 1px 8px rgba(30,20,60,0.04);transition:border-color .15s,transform .12s;`)} className={sp("hover", "transform:translateY(-2px)")}>
                            <div onClick={r.onOpen} style={css(`height:112px;border-radius:11px;overflow:hidden;background:${r.thumbBg ?? ""};display:flex;align-items:center;justify-content:center;color:${r.thumbFg ?? ""};`)}>
                              {" "}{r.thumb}{" "}
                            </div>
                            <div>
                              <div style={st192}>
                                {r.name}
                              </div>
                              <div style={st193}>
                                {r.meta}
                              </div>
                            </div>
                            {r.isFile ? (
                              <React.Fragment>
                                <div style={st24}>
                                  <button onClick={r.onStatusClick} style={css(`width:100%;display:flex;align-items:center;justify-content:space-between;gap:6px;padding:6px 11px;border:none;border-radius:999px;background:${r.stBg ?? ""};color:${r.stFg ?? ""};font-size:11.5px;font-weight:700;font-family:inherit;cursor:pointer;`)}>
                                    <span>
                                      {r.status}
                                    </span>
                                    {" "}
                                    <span style={st264}>
                                      {V.chevronMiniIcon}
                                    </span>
                                  </button>
                                  {r.menuOpen ? (
                                    <React.Fragment>
                                      <div onClick={r.closeMenu} style={st28}></div>
                                      <div onClick={V.stopProp} style={st265}>
                                        {(r.statusOptions || []).map((o, _i20) => (
                                          <React.Fragment key={_i20}>
                                            <button onClick={o.onClick} style={css(`display:flex;align-items:center;gap:8px;padding:8px 10px;border:none;border-radius:9px;background:${o.bg ?? ""};color:var(--text);font-size:12.5px;font-weight:600;font-family:inherit;text-align:left;cursor:pointer;`)} className={sp("hover", "background:var(--primary-softer)")}>
                                              <span style={css(`width:8px;height:8px;border-radius:50%;background:${o.dot ?? ""};flex:none;`)}></span>
                                              {" "}
                                              <span style={st11}>
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
                            <div style={st194}>
                              <button onClick={r.onRename} title="Renommer" style={st195} className={sp("hover", "background:var(--primary-softer)")}>
                                {V.penIcon}
                              </button>
                              <button onClick={r.onDelete} title="Supprimer" style={st196} className={sp("hover", "background:var(--neg-soft);color:var(--neg)")}>
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
                    <div style={st197}>
                      {(V.vidCards || []).map((r, _i11) => (
                        <React.Fragment key={_i11}>
                          <div draggable={r.draggable} onDragStart={r.onDragStart} onDragOver={r.onDragOver} onDragLeave={r.onDragLeave} onDrop={r.onDrop} onDoubleClick={r.onOpen} style={css(`display:flex;align-items:center;gap:14px;padding:11px 15px;border-bottom:1px solid var(--border);border-left:3px solid ${r.rowAccent ?? ""};cursor:pointer;`)} className={sp("hover", "background:var(--primary-softer)")}>
                            <div onClick={r.onOpen} style={css(`width:34px;height:34px;flex:none;border-radius:10px;background:${r.thumbBg ?? ""};color:${r.thumbFg ?? ""};display:flex;align-items:center;justify-content:center;`)}>
                              {r.smallIcon}
                            </div>
                            <div style={st16}>
                              <div style={st71}>
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
                            <div style={st266}>
                              {r.meta}
                            </div>
                            <button onClick={r.onRename} style={st199}>
                              {V.penIcon}
                            </button>
                            <button onClick={r.onDelete} style={st200} className={sp("hover", "background:var(--neg-soft);color:var(--neg)")}>
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
                    <div style={st201}>
                      <div style={st202}>
                        {V.videoBigIcon}
                      </div>
                      <div style={st203}>
                        {V.vidEmptyTitle}
                      </div>
                      <div style={st204}>
                        {V.vidEmptySub}
                      </div>
                    </div>
                  </React.Fragment>
                ) : null}
              </div>
              <div style={st205}>
                {"Astuce : clique le badge de statut pour le changer · glisse une vidéo sur un dossier pour la ranger."}
              </div>
            </div>
            {V.vidRenameOpen ? (
              <React.Fragment>
                <div onClick={V.vidRenameClose} style={st110}>
                  <div onClick={V.stopProp} style={st206}>
                    <div style={st112}>
                      {"Renommer"}
                    </div>
                    <input value={V.vidRenameVal ?? ""} onChange={V.onVidRenameVal} onKeyDown={V.onVidRenameKey} style={st207} />
                    <div style={st208}>
                      <button onClick={V.vidRenameClose} style={st209}>
                        {"Annuler"}
                      </button>
                      <button onClick={V.vidRenameSave} style={st210}>
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
                <div onClick={V.vidPreviewClose} style={st211}>
                  <div onClick={V.stopProp} style={st212}>
                    <div style={st213}>
                      {V.vidPreviewMedia}
                    </div>
                    <div style={st267}>
                      <div style={st268}>
                        <div style={st215}>
                          {V.vidPreviewName}
                        </div>
                        <div style={st216}>
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
                      <button onClick={V.vidPreviewClose} style={st218}>
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
            <div style={st269}>
              <div style={st270}>
                <span style={st271}>
                  {V.chantierIcon}
                </span>
                <div>
                  <div style={st272}>
                    {"En cours de développement"}
                  </div>
                  <div style={st251}>
                    {"Cette page n'est pas encore utilisable. On y reviendra."}
                  </div>
                </div>
              </div>
              <div style={st273}>
                <div style={st261}>
                  <div style={st274}>
                    <span style={st275}></span>
                    {"Données connectées "}
                  </div>
                  {(V.ctxChips || []).map((c, _i9) => (
                    <React.Fragment key={_i9}>
                      <div style={st276}>
                        {c.label}
                      </div>
                    </React.Fragment>
                  ))}
                  <div style={st11}></div>
                  {V.hasChat ? (
                    <React.Fragment>
                      <button onClick={V.resetChat} style={st277}>
                        {"Nouvelle conversation"}
                      </button>
                    </React.Fragment>
                  ) : null}
                </div>
                <div ref={V.chatScrollRef} style={st278}>
                  {V.chatEmpty ? (
                    <React.Fragment>
                      <div style={st279}>
                        <div style={st169}>
                          <div style={st280}>
                            {V.sparkIcon}
                          </div>
                          <div>
                            <div style={st281}>
                              {"Ton conseiller data"}
                            </div>
                            <div style={st282}>
                              {"Il lit tes commandes, marques, produits et vidéos, puis te dit quoi pousser."}
                            </div>
                          </div>
                        </div>
                        <div style={st283}>
                          {(V.suggestions || []).map((s, _i13) => (
                            <React.Fragment key={_i13}>
                              <button onClick={s.onClick} style={st284} className={sp("hover", "background:var(--primary-softer);border-color:var(--primary)")}>
                                {s.label}
                              </button>
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    </React.Fragment>
                  ) : null}
                  {(V.chatMsgs || []).map((m, _i9) => (
                    <React.Fragment key={_i9}>
                      {m.estUtilisateur ? (
                        <React.Fragment>
                          <div style={st285}>
                            <div style={st286}>
                              {m.text}
                            </div>
                            <div style={st287}>
                              {m.initiales}
                            </div>
                          </div>
                        </React.Fragment>
                      ) : null}
                      {" "}
                      {m.estAssistant ? (
                        <React.Fragment>
                          <div style={st288}>
                            <div style={st289}>
                              <svg width="27" height="27" viewBox="0 0 64 64" aria-hidden="true" style={st4}>
                                <path d="M11 47 A 28 28 0 0 1 53 22" fill="none" stroke="currentColor" stroke-width="6.5" stroke-linecap="round"></path>
                                <circle cx="47" cy="46" r="5.5" fill="currentColor"></circle>
                              </svg>
                            </div>
                            <div style={st290}>
                              {(m.segments || []).map((sg, _i15) => (
                                <React.Fragment key={_i15}>
                                  {sg.estTexte ? (
                                    <React.Fragment>
                                      <div style={st291}>
                                        {sg.texte}
                                      </div>
                                    </React.Fragment>
                                  ) : null}
                                  {" "}
                                  {sg.estPuce ? (
                                    <React.Fragment>
                                      <div style={st292}>
                                        <span style={st293}></span>
                                        <div style={st294}>
                                          {sg.texte}
                                        </div>
                                      </div>
                                    </React.Fragment>
                                  ) : null}
                                  {" "}
                                  {sg.estAction ? (
                                    <React.Fragment>
                                      <div style={st295}>
                                        <span style={st296}>
                                          {"À FAIRE"}
                                        </span>
                                        <div style={st297}>
                                          {sg.texte}
                                        </div>
                                      </div>
                                    </React.Fragment>
                                  ) : null}
                                </React.Fragment>
                              ))}
                            </div>
                          </div>
                        </React.Fragment>
                      ) : null}
                    </React.Fragment>
                  ))}
                  {V.chatBusy ? (
                    <React.Fragment>
                      <div style={st298}>
                        <div style={st299}>
                          <svg width="27" height="27" viewBox="0 0 64 64" aria-hidden="true" style={st4}>
                            <path d="M11 47 A 28 28 0 0 1 53 22" fill="none" stroke="currentColor" stroke-width="6.5" stroke-linecap="round"></path>
                            <circle cx="47" cy="46" r="5.5" fill="currentColor"></circle>
                          </svg>
                        </div>
                        <div style={st300}>
                          <span style={st301}></span>
                          {" "}
                          <span style={st302}></span>
                          {" "}
                          <span style={st303}></span>
                        </div>
                      </div>
                    </React.Fragment>
                  ) : null}
                  {" "}
                  {V.chatErr ? (
                    <React.Fragment>
                      <div style={st304}>
                        {V.chatErr}
                      </div>
                    </React.Fragment>
                  ) : null}
                </div>
                <div style={st305}>
                  <textarea value={V.chatInput ?? ""} onChange={V.onChatInput} onKeyDown={V.onChatKey} placeholder="Demande-lui : sur quelle marque appuyer aujourd'hui ?" style={st306}></textarea>
                  <div style={st307}>
                    <div style={st308}>
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
            </div>
          </React.Fragment>
        ) : null}
        {V.isOther ? (
          <React.Fragment>
            <div style={st309}>
              <div style={st310}>
                {V.otherIcon}
              </div>
              <div style={st311}>
                {V.pageTitle}
              </div>
              <div style={st312}>
                {"Cette section n'est pas incluse dans cette maquette — le focus est sur le "}
                <strong style={st313}>
                  {"Dashboard"}
                </strong>
                {" et "}
                <strong style={st313}>
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
