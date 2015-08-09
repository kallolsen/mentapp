Mentorships = new Meteor.Collection("mentorships");
Projects = new Meteor.Collection('projects');

Router.configure({
    layoutTemplate: 'main'
});

Router.route('/', {
    name: 'home',
    template: 'home'
});

Router.route('/project/:_id', {
    name: 'projectPage',
    template: 'projectPage',
    data: function(){
        var currentList = this.params._id;
        return Projects.findOne({ _id: currentList });
    }
});

Router.route('/register');

Router.route('/login');


if (Meteor.isClient) {

  Template.mentorships.helpers({
      'mentorship': function(){
        var currentProject = this._id;
        var currentUser = Meteor.userId();
        return Mentorships.find({ projectId: currentProject, createdBy: currentUser }, {sort: {createdAt: -1}})
      }
  });

  Template.mentorshipItem.helpers({
    'status': function(){
        var isAvailable = this.available;
        if(isAvailable){
            return "Yes";
        } else {
            return "No";
        }
    }
  });

  Template.mentorshipCount.helpers({
    'totalMentorships': function(){
        var currentProject = this._id;
        return Mentorships.find({ projectId: currentProject }).count();
    },
    'availableMentorships': function(){
        var currentProject = this._id;
        return Mentorships.find({ projectId: currentProject, available: true }).count();
    }
  });


  Template.addMentorship.events({
      'submit form': function(event){
        event.preventDefault();
        var mentorshipSubject = $('[name="mentorshipSubject"]').val();
        var currentUser = Meteor.userId();
        var currentProject = this._id;
        //console.log(mentorshipSubject);
        Mentorships.insert({
            subject: mentorshipSubject,
            createdBy: currentUser,
            available: true,
            createdAt: new Date(),
            projectId: currentProject
        });
        $('[name="mentorshipSubject"]').val('');
      } 
  }); 

  Template.mentorshipItem.events({

    'click .delete-mentorship': function(event){
      event.preventDefault();
      var documentId = this._id;
      var confirm = window.confirm("Delete this task?");
      if(confirm){
        Mentorships.remove({ _id: documentId });
      }
    },


    'keyup [name=mentorshipItem]': function(event){
      if(event.which == 13 || event.which == 27){
        $(event.target).blur();
      } else {
        var documentId = this._id;
        var mentorshipItem = $(event.target).val();
        Mentorships.update({ _id: documentId }, {$set: { subject: mentorshipItem }});
        //console.log(event.which);
      }
    },

    'change [type=checkbox]': function(){
      console.log("You checked or unchecked this checkbox");
      var documentId = this._id;
      var isAvailable = this.available;
      console.log(isAvailable);
      if(isAvailable){
        console.log("Mentorship was available");
        Mentorships.update({ _id: documentId }, {$set: { available: false }});
        console.log("But now, Mentorship is marked as unavailable.");
      } else {
        console.log("Mentorship was unavailable");
        Mentorships.update({ _id: documentId }, {$set: { available: true }});
        console.log("But now, Mentorship is marked as available.");
      }
    }

  });

  Template.addProjectTopic.events({
    'submit form': function(event){
      event.preventDefault();
      var topicName = $('[name="topicName"]').val();
      var currentUser = Meteor.userId();
      console.log(topicName);
      console.log(currentUser);
      Projects.insert({
          name: topicName,
          createdBy: currentUser
        }, function(error, results){
            Router.go('projectPage', { _id: results });
      });
      $('[name="topicName"]').val('');
    }
  });

  Template.projects.helpers({
      'project': function(){
        return Projects.find({}, {sort: {name: 1}});
        //var currentUser = Meteor.userId();
        //return Projects.find({ createdBy: currentUser }, {sort: {name: 1}});
      }
  });


  Template.register.events({
    'submit form': function(event){
        event.preventDefault();
        var email = $('[name=email]').val();
        var password = $('[name=password]').val();
        Accounts.createUser({
          email: email,
          password: password
        }, function(error){
            if(error){
                console.log(error.reason); // Output error if registration fails
            } else {
                Router.go("home"); // Redirect user if registration succeeds
            }
        });
    }
  });

  Template.navigation.events({
    'click .logout': function(event){
        event.preventDefault();
        Meteor.logout();
        Router.go('login');
    }
  });

  Template.login.events({
    'submit form': function(event){
        event.preventDefault();
        var email = $('[name=email]').val();
        var password = $('[name=password]').val();
        Meteor.loginWithPassword(email, password, function(error){
          if(error){
              console.log(error.reason);
          } else {
              Router.go("home");
          }
        });
    }
  });

}

if (Meteor.isServer) {
 
}
