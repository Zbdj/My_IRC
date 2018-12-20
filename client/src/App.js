import React, { Component } from 'react';
// import ReactDOM, { render } from 'react-dom';
import openSocket from 'socket.io-client';

import { BrowserRouter as Router } from "react-router-dom";
import Route from "react-router-dom/Route";

import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.socket = openSocket('http://localhost:8080');

    this.state = {
                  pseudo_online: '',
                  message: '',
                  pseudo: '',
                  edit: [],
                  resultats: []
                }
    // this.state = {message: ''};

    // this.state = {pseudo: ''};

    // this.state = {edit: []};

    // this.state = {resultats: []};


    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    
    
    this.socket.on('result', (data) => {
      this.setState({
        resultats: [ ...this.state.resultats, data ]
      })
      // console.log(data);
    });

    this.socket.on('edit', (edit_blaze) => {
      // console.log(edit_blaze.ancien_blaze)
      this.setState({
        edit: [ ...this.state.edit, edit_blaze ]
      })

      document.getElementById("body").style.color = "orange";
      document.getElementById("body").style.visibility = "visible";

      document.getElementById("body").innerHTML = edit_blaze.ancien_blaze + " a changé son pseudo en " + edit_blaze.new_blaze;

      setTimeout(edit, 3000)
        function edit()
        {
          document.getElementById("body").style.visibility = "hidden";
        }

    });

      this.socket.on('blaze', (nom) => {
        this.setState({
          pseudo_online: [ ...this.state.pseudo_online, nom ]
        })

      // console.log(this.state.pseudo_online)
      });

  }


  handleChange(event) {
    this.setState({username: event.target.value});
  }

  new_value(event)
  {
    this.setState({message: event.target.value});

  }

  handleSubmit(event) {
    event.preventDefault();
  }


  redirect()
  {
    var username = this.state.username;

    sessionStorage.setItem('pseudo', username);

    var nom = sessionStorage.getItem('pseudo');

    this.socket.emit('pseudo', nom );

    window.location.href = '/chat';


  }

  send_message()
  {

    var message = this.state.message;
    var blaze = sessionStorage.getItem('pseudo');

    if(message === '/nick' + message.substr(5)){
      var ancien_blaze = sessionStorage.getItem('pseudo');
      var new_blaze = message.substr(6);

      alert('Votre pseudo ' + ancien_blaze + ' a été changé en ' + new_blaze);

      this.socket.emit('blaze',{ ancien_blaze,new_blaze });
      
      sessionStorage.setItem('pseudo',message.substr(6));
      
    }
    else if(message === '/users')
    {
      var user_co = this.state.pseudo_online;

        if(user_co === "")
        {
          document.getElementById("body").style.color = "red";
          document.getElementById("body").style.visibility = "visible";

          document.getElementById("body").innerHTML = "aucun user connecté sur ce channel";

          setTimeout(edit, 3000)
            function edit()
            {
              document.getElementById("body").style.visibility = "hidden";
            }
      }

      else{
        document.getElementById("body").style.color = "blue";
        document.getElementById("body").style.visibility = "visible";
  
        document.getElementById("body").innerHTML = user_co + " connecté sur ce channel";
  
        setTimeout(edit, 3000)
          function edit()
          {
            document.getElementById("body").style.visibility = "hidden";
          }
      }

    }
    else{
      this.socket.emit('data', {blaze, message});
    }

  }
    deco()
    {
      sessionStorage.removeItem('pseudo');
      window.location.href = '/';

    }
  render() {

    const submit = this.handleSubmit.bind(this);
    const username = this.state.username;
    const value_change = this.handleChange;
    const function_redirect = this.redirect.bind(this);

    const message = this.state.message;
    const send_message = this.send_message.bind(this);
    const new_value = this.new_value.bind(this);

    const deco = this.deco.bind(this);

    // const newpseudo = this.state.edit;

    const liste = this.state.resultats;

//  console.log(this.state.edit)

    return (
      <div>
        <Router>
            <Route path="/" exact render={
              function()
              {
                var redirect = sessionStorage.getItem('pseudo');
              
                if(redirect !== null)
                {
                  window.location.href = '/chat';
                }

                return(
                  <form onSubmit={ submit }>
                    <label>
                      Pseudo:
                      <input type="text" value={ username } onChange={ value_change }/>
                    </label>
                    <input type="submit" value="Submit" id="pseudo" onClick={ function_redirect }/>
                  </form>
                );
              }}/>
          </Router>

          <Router>
          <Route path="/chat" exact render={
            function()
            {
              var redirect = sessionStorage.getItem('pseudo');

              if(redirect === null)
              {
                window.location.href = '/';
              }
              return(
                <div>
                  <button onClick = {deco}>Deconnection</button>
                <form onSubmit={ submit }>
                <label>
                  Message:
                  <input type="text" value={ message } onChange={ new_value }/>
                </label>
                <input type="submit" value="Submit" id="pseudo" onClick={ send_message } />
              </form>


          {
            liste.map(function(item, i){
              // console.log(i);
              return <p key={i}> {item.blaze} a envoyé : {item.message} </p>
            })  
          }

            <div>
              <p id="body"></p>
            </div>

          {
            // newpseudo.map(function(item, i){
            //   console.log(i);
            //   return <p key={i}> {item.ancien_blaze} a modifié son pseudo en  : {item.new_blaze} </p>
            // })
            // <p>{ newpseudo.ancien_blaze }</p>
            // console.log(newpseudo)
          }


              </div>
              

            );

            }}/>
          </Router>
        </div>
      );
  }
}

export default App;
