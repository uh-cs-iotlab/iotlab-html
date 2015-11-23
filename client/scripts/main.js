// main.js
var React = require('react')
  , ReactDOM = require('react-dom')
  , $ = require('jquery')

var Header = React.createClass({
  render: function() {
    return (
      <header className="header">
        <h3 className="title">{this.props.title}</h3> 
      </header>
    );
  }
});

var NavBar = React.createClass({
  render: function () {
    return (
      <div>
        <div className="navbar-spacer" />
        <nav className="navbar">
          <ul className="container">
            {this.props.menus.map(function(menu) {
              return (<li key={menu.id} className="navbar-item">
                        <a className="navbar-link" href={menu.href}>{menu.name}</a>
                      </li>);
	    })}
          </ul>
        </nav>
      </div> 
    );
  }
});

var Activity = React.createClass({

  render: function() {
    return (
      <h2 className="activityName">{this.props.name}</h2>
    );
  }

});

var Activities = React.createClass({
  
  getInitialState: function() {
    return {data: []};
  },

  componentDidMount: function() {
    this.loadActivitiesFromServer();
  },
  
  loadActivitiesFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  render: function() {
    var activityNodes = this.state.data.map(function(activity) {
      return (
        <Activity name={activity.name} key={activity.id} />
      );
    });
    return (
      <section className="section activities">
        {activityNodes}
      </section>
    );
  }
});

var App = React.createClass({
  render: function() {
    var menus = [
	{"id": 1, "href": "/", "name": "Home"},
	{"id": 2, "href": "/activities", "name": "Activities"},
	{"id": 3, "href": "/people", "name": "People"},
	{"id": 4, "href": "/about", "name": "About"}
    ];
    return (
      <div>
        <Header title={this.props.title} description={this.props.description} />
        <NavBar menus={menus} />
        <Activities url="/api/activities" />
      </div>
    );
  }
});

ReactDOM.render(
  <App title="IoT Lab" />,
  document.getElementById('content')
);
