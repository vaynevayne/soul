import{j as c}from"./jsx-runtime-91a467a5.js";import{a as p,o as m}from"./mockData-809faabf.js";import{r as n}from"./index-8db94870.js";import"./iframe-51b25fdd.js";import"../sb-preview/runtime.js";import"./index-58d3fd43.js";import"./_commonjsHelpers-042e6b4d.js";import"./index-1a3285a9.js";import"./assertThisInitialized-a50ab1d7.js";const L={title:"Components/SideSelect",component:p},y=({...S})=>{const[t,r]=n.useState([]);console.log("value",t);const[s,d]=n.useState("whereIn");let e="preset_country";return c(p,{style:{width:200},value:t,popupMatchSelectWidth:400,onChange:r,soul:{modeList:[{label:"反选",value:"whereNotIn"}],optionsWidth:100,presetsWidth:100,mode:s,onModeChange:o=>d(o),presets:JSON.parse(localStorage.getItem(e)||"[]"),onAddPreset:async o=>{console.log("addPreset",o);const i=JSON.parse(localStorage.getItem(e)||"[]");localStorage.setItem(e,JSON.stringify(i.concat(o)))},onDeletePreset:async o=>{const i=JSON.parse(localStorage.getItem(e)||"[]");localStorage.setItem(e,JSON.stringify(i.filter(x=>x.label!==o.label)))}},...S})},I=({...S})=>{const[t,r]=n.useState([]),[s,d]=n.useState("whereIn");return console.log("mode",s),console.log("value",t),n.useEffect(()=>{console.log("css",`.react-resizable-handle {
  position: absolute;
  top: 0px;
  bottom: 0px;
  height: 100%;
  width: 4px;
  border-right: 1px dashed rgb(44, 46, 51);
  cursor: col-resize;
}
.react-resizable-handle:hover {
  background-color: rgb(44, 46, 51);
}`)},[]),c(p,{popupMatchSelectWidth:300+100,style:{width:"100%"},options:m,value:t,onChange:(...e)=>{if((t==null?void 0:t.length)===1&&e[0].length===2&&["like","notLike"].includes(s)){alert("只支持单选like,notLike");return}r==null||r(e[0])},soul:{modeList:[],optionsWidth:300,presetsWidth:100,mode:s,onModeChange:e=>{d(e)},presets:[],onAddPreset:()=>{},onDeletePreset:()=>{}}})},l={name:"非受控模式",render:()=>c(y,{options:m})},a={name:"受控模式",render:()=>c(I,{options:m})};var g,u,h;l.parameters={...l.parameters,docs:{...(g=l.parameters)==null?void 0:g.docs,source:{originalSource:`{
  name: "非受控模式",
  render: () => <UnControlled options={options} />
}`,...(h=(u=l.parameters)==null?void 0:u.docs)==null?void 0:h.source}}};var C,f,b;a.parameters={...a.parameters,docs:{...(C=a.parameters)==null?void 0:C.docs,source:{originalSource:`{
  name: "受控模式",
  render: () => <Controlled options={options} />
}`,...(b=(f=a.parameters)==null?void 0:f.docs)==null?void 0:b.source}}};const U=["UnControlledSideSelect","ControlledSideSelect"];export{a as ControlledSideSelect,l as UnControlledSideSelect,U as __namedExportsOrder,L as default};
//# sourceMappingURL=SideSelect.stories-a5c5d89b.js.map
