var Counter = React.createClass({
  render: function() {
    return (
      <p>{this.props.text}out of {this.props.data.length} completed</p>
    )
  }
});

// var Comment = React.createClass({
// handleClick:function(){
//  this.prop
// },
//
//
//   render: function() {
//     if(this.props.done){
//      var input=  <input type="checkbox" checked="checked"  />;
//     }
//     else{
//       var input=  <input type="checkbox"  />;
//     }
//     return (
//
//            <li onClick={this.handleClick} >
//           {input}
//            { this.props.author }
//
//           </li>
//
//     );
//   }
//
// });

var CommentRow = React.createClass({

  handleClick: function(i) {
   var value;
   this.setState({value:true});
   if (this.props.data.done) {
     this.props.data.done=false;
   }
   else {
     this.props.data.done=true;
   }

 },
  render: function () {
    var input,
      rowTitle;

    if ( this.props.data.done ) {
      input = <input type="checkbox" ref="myInput" data-key={ this.props.key } checked="checked" />;
      rowTitle = <del>{ this.props.data.author }</del>;
    } else {
      input = <input type="checkbox" ref="myInput" data-key={ this.props.key } />;
      rowTitle = <span>{ this.props.data.author }</span>;
    }

    return <li onClick={this.handleClick.bind(this)}>{ input } { rowTitle }</li>;
  },
  // componentDidMount: function () {
  //   var input = React.findDOMNode(this.refs.myInput);
  //   input.addEventListener('change', this.toggle, false);
  // },
  // toggle: function (e) {
  //   var target = e.target,
  //       index = target.getAttribute( 'data-key' );
  //
  //   console.log( 'index: %n, key: %s, value: %s', index, 'done', target.value );
  //   // this.props.toggle(index, 'done', target.value);
  // }
});

var CommentList = React.createClass({

  render: function() {
    var list = this.props.data.map(function (item, index) {
      return <CommentRow data={ item } key={ index } />
    });
    return (
      <ul>{ list }</ul>
    );
  }
});


var CommentForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var author = React.findDOMNode(this.refs.author).value.trim();
    var text=false;
    if (!author) {
      return;
    }
    this.props.onCommentSubmit({author: author ,done:text});
    React.findDOMNode(this.refs.author).value = '';

    return;
  },
  render: function() {
    return (
      <form className="commentForm" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="Your name" ref="author" />

        <input type="submit" value="Post" />
      </form>
    );
  }
});



var CommentBox = React.createClass({
  loadCommentsFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),

    });
  },
  handleCommentSubmit: function(comment) {
    var comments = this.state.data;
    var newComments = comments.concat([comment]);
    this.setState({data: newComments});

  },
  updateItem: function (index, key, value) {
    var data = this.state.data;
    data[index][key] = value;
    this.setState({
      data: data
    });
  },
  getInitialState: function() {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadCommentsFromServer();

  },
  render: function() {
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList data={ this.state.data } updateItem={ this.updateItem }  />
        <CommentForm onCommentSubmit={ this.handleCommentSubmit } />
        <Counter data={this.state.data} />
      </div>
    );
  }
});





React.render(
  <CommentBox url="comments.json"  />,
  document.getElementById('content')
);
