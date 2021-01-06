import React, { Component } from 'react';
import './App.css';
import ReactDOM from 'react-dom';

class CardSearch extends React.Component {
  constructor(props){
    super(props)
    this.searchedVals= []
    this.state={
      searchedVals:'',
    }
  }
  componentDidMount(){
    document.addEventListener('keydown', this.handleKeyPress)
  }
  componentWillUnmount(){
    document.removeEventListener('keydown', this.handleKeyPress)
  }
handleKeyPress=(event)=>{
if(event.keyCode===13){
  const search=document.getElementById('cardSearch').value
  if(this.props.searched){
    //this.props.searched.map(i=>this.searchedVals.push(i.toLowerCase()))
    this.searchedVals=this.props.searched;
  }
  if(!this.searchedVals.includes(search)){
    //this.searchedVals.push(search)
  setTimeout(this.props.scryData(search),100);
  }
}

}
handleClick=()=>{
  const search=document.getElementById('cardSearch').value
  if(this.props.searched){
    //this.props.searched.map(i=>this.searchedVals.push(i.toLowerCase()))
    this.searchedVals=this.props.searched;
  }
  if(!this.searchedVals.includes(search)){
    //this.searchedVals.push(search)
  setTimeout(this.props.scryData(search),100);
  }
}

render(){
 return(
  <div id="searchContainer">
  <div>Card Search</div>
  <input id="cardSearch" type="search" autoComplete="on"></input>
  <button id="getCard" onClick={this.handleClick}>Add Card</button>
  </div>
 )
}
};

class NewTableRow extends Component{
  constructor(props){
    super(props)
    this.languages=[]
    this.sets=Object.keys(this.props.mtgInfo)
    this.state={
      flipArt:this.props.mtgInfo[this.sets[0]].card_faces ?this.props.mtgInfo[this.sets[0]].card_faces[1].image_uris.normal : '',
      art:this.props.mtgInfo[this.sets[0]].card_faces ?this.props.mtgInfo[this.sets[0]].card_faces[0].image_uris.normal : this.props.mtgInfo[this.sets[0]].image_uris.normal,
      foreignNames:[],
      savedImage:this.props.mtgInfo[this.sets[0]].card_faces ?this.props.mtgInfo[this.sets[0]].card_faces[0].image_uris.normal : this.props.mtgInfo[this.sets[0]].image_uris.normal,
      name:this.props.cardname,
    }
  }
  flipArt =(front, back) =>{
    this.setState({flipArt:back,art:front,savedImage:front})
  }
  updateImage =(image, name) =>{
    this.setState({art:image,savedImage:image, name})
  }
  createLanguages=(e) =>{
      e.foreignNames ? this.languages=e.foreignNames.map(l=><Language updateImage={this.updateImage} cardname={e.name} foreignInfo={l} key={l.name} />)
      : (e.card_faces && e.card_faces[0].foreignNames) ? this.languages=e.card_faces[0].foreignNames.map(l=><Language updateImage={this.updateImage} cardname={e.name} foreignInfo={l} key={l.name}/>)
      : this.languages=[]
      this.setState({foreignNames:this.languages})
  }
  handleMouseOver = () =>{
      if(this.state.flipArt){
        this.setState({art:this.state.flipArt})
      }
  }
  handleMouseOut =()=>{
      this.setState({art:this.state.savedImage})
  }
  render(){
    const amount =this.sets.map(obj=><Amount updateAmount={this.props.updateAmount} key={this.props.mtgInfo[obj].multiverse_ids[0]? this.props.name + ' ' +this.props.mtgInfo[obj].multiverse_ids[0] : this.props.name+obj} mtgInfo={this.props.mtgInfo[obj]}/>)
    const sets=this.sets.map(obj=><Sets flipArt={this.flipArt} createLanguages={this.createLanguages} mtgInfo={this.props.mtgInfo[obj]} buttonGroup={this.props.cardname} key={this.props.cardname + ' ' +obj} set={obj}/>)
    return(
      <tr id={this.props.cardname}>
        <td>
          <div id="cardname">{this.state.name}</div>
          <img src={this.state.art} onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut}/>
        </td>
        <td>
          <div className="amountContainer">
          
          {amount}
          </div>
        </td>
        <td>
          <div className="sets">
          {sets}
          
          </div>
        </td>
        <td id="language">
        <div className="langContainer">
        {this.state.foreignNames.map(l=>l)}
        </div>
        </td>
        <td>
          <button type="button" id={this.props.cardname + 'remove'} onClick={()=>this.props.removeRow(this.props.cardname)}>
            <i className="fa fa-trash-o" aria-hidden="true" />
          </button>
        </td>
      </tr>
    )
  }
}

class Amount extends React.Component{
  constructor(props){
    super(props)
    this.state={
      usd:this.props.mtgInfo.usd ? Number(this.props.mtgInfo.usd)*Number(this.props.mtgInfo.amount): 0.00,
      euros:this.props.mtgInfo.eur ? Number(this.props.mtgInfo.eur)*Number(this.props.mtgInfo.amount): 0.00,
      tix:this.props.mtgInfo.tix ? Number(this.props.mtgInfo.tix)*Number(this.props.mtgInfo.amount): 0.00,
      amount:this.props.mtgInfo.amount,
    }
  }
  updatePrice = (amount) =>{
    this.props.updateAmount(this.props.mtgInfo.name, this.props.mtgInfo.set_name,Number(amount.target.value))
    if(this.props.mtgInfo.usd !== undefined){
    this.setState({
      usd:Number(this.props.mtgInfo.usd)*amount.target.value})
  }
  if(this.props.mtgInfo.eur !== undefined){
    this.setState({euros:Number(this.props.mtgInfo.eur)*amount.target.value})
  }
  if(this.props.mtgInfo.tix !== undefined){
    this.setState({tix:Number(this.props.mtgInfo.tix)*amount.target.value})
  }
  }
  render(){
    const id= this.props.mtgInfo.multiverse_ids[0] !== undefined ? this.props.mtgInfo.multiverse_ids[0]
    : this.props.mtgInfo.set_name;
    return(
      <div className={id}>
        <div className="usd">&#36; {this.state.usd.toFixed(2)}</div>
        <div className="euros">&#8364; {this.state.euros.toFixed(2)}</div>
        <div className="tix">Tix {this.state.tix.toFixed(2)}</div>
        <input className="amount" type="number" onChange={(e)=>this.updatePrice(e)} min="0" defaultValue={this.props.mtgInfo.amount}></input>
      </div>
    )
  }
}

class Sets extends React.Component{
  constructor(props){
    super(props)
    this.pic=[]
  }
  imgChange =()=>{
    this.pic= this.props.mtgInfo.card_faces !== undefined ? this.props.mtgInfo.card_faces[0].image_uris.normal :
    this.props.mtgInfo.image_uris.normal;
    document.getElementById(this.props.buttonGroup).querySelector('img').src=this.pic;
    document.getElementById(this.props.buttonGroup).querySelector('.langContainer').querySelectorAll('input').forEach(b=>b.checked=false) 
    document.getElementById(this.props.mtgInfo.name).querySelector('#cardname').textContent=this.props.buttonGroup;
    document.getElementById(this.props.buttonGroup).querySelector('.langContainer').querySelectorAll('input').forEach(b=>b.checked=false) 
  }
  render(){
    let flipPic
    if(this.props.mtgInfo.card_faces){
      flipPic=this.props.mtgInfo.card_faces[1].image_uris.normal
    }
    return(
      <div>
        <input type="radio" name={this.props.buttonGroup} onClick={()=>{this.imgChange(); this.props.createLanguages(this.props.mtgInfo); this.props.flipArt(this.pic,flipPic)}} /*onClick={this.imgChange.bind(this)}*/></input>
        <label>{this.props.set}</label>
        <br />
      </div>
    )
  }
}

class Language extends React.Component{
  constructor(props){
    super(props)
  }
  render(){
    return(
      <div>
        <input name={this.props.cardname+'foreign'} type="radio" onClick={()=>this.props.updateImage(this.props.foreignInfo.imageUrl,this.props.foreignInfo.name)} />
        <label>{this.props.foreignInfo.language}</label>
      </div>
    )
  }
}
class App extends React.Component {
  constructor(props){
    super(props)
    this.displayData=[];
    this.mtgCards=[];
    this.cards={};
    this.totalCards={}
    this.searchedCards=[];
    this.state={
      showdata:this.displayData,
      totalCards:'',
      searchedCards:'',
    }
  }
  
  mtgFetch = (arr) => {
    arr.map(value => {
      fetch("https://api.magicthegathering.io/v1/cards?name="+value,{
      method:"GET"
    })
    .then(res=>res.json())
    .then(data=>{
      data.cards.map(i=>{
        if(i.foreignNames.length>0){
          //console.log('this.cards', this.cards)
          for(let j in this.cards){
            if(j.includes(i.name)){
              this.cards[j][i.setName].card_faces ? this.cards[j][i.setName].card_faces.map(k=>{if(k.name===i.name) k.foreignNames=i.foreignNames})
              : this.cards[j][i.setName].foreignNames=i.foreignNames;
            }
          }
        }
      })

      /*for(let i in this.cards){
        names.map(c=>{
          if(i.includes(c.name)){
            //SAVE INCASE MTG API HAS FLIP CARD FOREIGN NAMES            
            if(i.indexOf('/')>-1){
              this.cards[i].map(a=>{
                if(a.set_name===c.setName){
                a.card_faces.map(b=>{
                  if(b.name===c.name){
                    b.foreignNames=c.foreignNames
                  }
                })
              }
              })
            }else{
            this.cards[i].map(a=>{
              if(a.set_name===c.setName){
                a.foreignNames=c.foreignNames
              }
            })
            }
            //SAVE IN CASE MTG API WORKS LIKE IT USED TO
          }
        })
      }*/


    })
    })
  }
  scryFetch = (value)=>{
    fetch("https://api.scryfall.com/cards/search?unique=prints&q="+value,{
      method:"GET"
    })
    .then(res=>res.json())
    .then(data=>{
      const cardsObj =data.data.reduce((res, item)=>{
        if(res[item.name]===undefined){
          res[item.name]={}
        } 
        res[item.name][item.set_name]={};
        item.amount=0;
        item.card_faces ? item.card_faces.map(j=>j.foreignNames=[]) : item.foreignNames=[] 
        for(let i in item){
            res[item.name][item.set_name][i]=item[i]
        }
        return res;
      },{})
    
      for(let i in cardsObj){
        if(i.indexOf('/')===-1 && !this.searchedCards.includes(i)){
          this.searchedCards.push(i)
        } 
        for(let j in cardsObj[i])
        if(cardsObj[i][j].card_faces){
          cardsObj[i][j].card_faces.map(n=>{
            if(!this.searchedCards.includes(n.name)){
            this.searchedCards.push(n.name)
          }
        })
        }
        this.totalCards[i]=cardsObj[i]
      }
      //console.log('searchedCards', this.searchedCards)
      this.cards=cardsObj
      this.mtgFetch(this.searchedCards)
      this.setState({searchedCards:this.searchedCards,totalCards:this.totalCards})
      this.appendRow();
      
    })
  }
  
  //rerender DOM elements instead of delete them
  removeRow= (e) =>{
    const removeDisplay = this.state.showdata.filter(i=>i.key!==e)
    const removeSearched=this.state.searchedCards.filter(i=>i!==e)
    const removeTotalCards=this.state.totalCards;
    delete removeTotalCards[e]
    this.setState({showdata:removeDisplay, searchedCards:removeSearched,totalCards:removeTotalCards},()=>console.log(this.state)) 
    this.displayData = removeDisplay;
  }
  appendRow =() =>{
     let keys=this.displayData.map(o=>o.key)
      for(let i in this.state.totalCards){
       if(!keys.includes(i)){
         this.displayData.unshift(<NewTableRow removeRow={this.removeRow} key={i} mtgInfo={this.state.totalCards[i]} cardname={i} updateAmount={this.updateAmount}/>)
       }
     }
     this.setState({showdata:this.displayData})
    }

  updateAmount = (name, set, val) =>{
    let update=this.state.totalCards
    update[name][set].amount=val;
    this.setState({totalCards:update})
  }
  saveCollection = () =>{
    window.localStorage.setItem('collection', JSON.stringify(this.state.showdata))
    window.localStorage.setItem('totalCards', JSON.stringify(this.state.totalCards))
    window.localStorage.setItem('searchedCards',JSON.stringify(this.state.searchedCards))
  }
  loadCollection = () =>{
    let totalCards =JSON.parse(window.localStorage.getItem('totalCards'))
    let searchedCards=JSON.parse(window.localStorage.getItem('searchedCards'))
    let currData=this.displayData.map(i=>i.key)
    JSON.parse(window.localStorage.getItem('collection')).map(i=>!currData.includes(i.key)?this.displayData.unshift(<NewTableRow removeRow={this.removeRow} key={i.key} mtgInfo={i.props.mtgInfo} cardname={i.key} updateAmount={this.updateAmount}/>):'')
    this.setState({showdata:this.displayData,totalCards,searchedCards})
  }
  
  render() {
    return (
      <div id="main">
      <CardSearch searched={this.state.searchedCards} key={'cardsearch'} scryData={this.scryFetch}/>
      <button onClick={this.saveCollection}>Save Collection</button>
      <button onClick={this.loadCollection}>Load Collection</button>
      <div id='labels'>
      <div id="cardTable">Card</div>
      <div id="amountTable">Amount</div>
      <div id="setTable">Set</div>
      <div id="language">Language</div>
      <div id="remove"></div>
      </div>
      <table id="cardInfo">
      <tbody>  
        {this.state.showdata.map(i=>i)}
      </tbody>
      </table>
      </div>
    );
  }
}

export default App;