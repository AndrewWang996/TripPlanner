if (Settings.find().count() === 0) {
  Settings.insert({ 
    'appName': 'TripPlanner', 
    'schoolName': 'MIT',
    'aboutLink': 'https://github.com/AndrewWang996',
    'contactEmail': 'andy5595@mit.edu',
    'facebookPage': 'https://www.facebook.com/supdude.andy',
    'defaultEmail': 'andy5595@mit.edu',
    'defaultEmailName': 'Andy Wang',
    'pointsPerHour': 4,
    'likes': 0 
  });
}