// 
// initialize firebase
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var config = {
  apiKey: "AIzaSyBLytXuD57EnB7Un-h_IUG1BrwJWaDje44",
  authDomain: "traintimehw-57906.firebaseapp.com",
  databaseURL: "https://traintimehw-57906.firebaseio.com",
  projectId: "traintimehw-57906",
  storageBucket: "traintimehw-57906.appspot.com",
  messagingSenderId: "512870427460"
};

firebase.initializeApp(config);

// simplify database connection
var db = firebase.database();

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

$("#add-train-button").on("click", function() {

  // grab input
  var frequency = $("#frequency-input").val().trim();
  var trainName = $("#train-name-input").val().trim();
  var destination = $("#destination-input").val().trim();
  var firstArrival = $("#first-arrival-input").val().trim();

  // local object for data
  var newTrain = {
    name: trainName,
    frequency: frequency,
    destination: destination,
    firstArrival: firstArrival
  };

  // send data to firbase
  db.ref().push(newTrain);

  alert("Train added successfully");

  // reset form
  $("#frequency-input").val("");
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#first-arrival-input").val("");

  // test console
  // console.log(newTrain.name);
  // console.log(newTrain.frequency);
  // console.log(newTrain.destination);
  // console.log(newTrain.firstArrival);

  // prevent submit button from reloading page
  return false;

});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

db.ref().on("child_added", function(childSnapshot) {

  console.log(childSnapshot.val());

  // store firebase data in variables
  var fbName = childSnapshot.val().name;
  var fbFrequency = childSnapshot.val().frequency;
  var fbArrival = childSnapshot.val().firstArrival;
  var fbDestination = childSnapshot.val().destination;

  // console.log(fbArrival)

  var nextArrival;
  var minUntilArrival;
  var arrivalTime = fbArrival.split(":");
  var trainTime = moment().hours(arrivalTime[0]).minutes(arrivalTime[1]);
  var maxMoment = moment.max(moment(), trainTime);

  if (maxMoment === trainTime) {
    nextArrival = trainTime.format("hh:mm A");
    minUntilArrival = trainTime.diff(moment(), "minutes");

  } else {
    var timeDifference = moment().diff(trainTime, "minutes");
    var remainingTime = timeDifference % fbFrequency;
    minUntilArrival = fbFrequency - remainingTime;
    nextArrival = moment().add(minUntilArrival, "m").format("hh:mm A");
  }

  // add data to table
  $("#train-table > tbody").append("<tr><td>" + fbName + "</td><td>" + fbDestination + "</td><td>" + fbFrequency + "</td><td>" + nextArrival + "</td><td>" + minUntilArrival + "</td></tr>");

  // test
  console.log(minUntilArrival + " minutes until arrival");
  console.log("Next arrival in " + nextArrival + " minutes");

});