# AirQualityApp
CISC375 Air Quality App

Bootstrap 4 - https://www.w3schools.com/bootstrap4/default.asp
AngularJS - https://www.w3schools.com/angular/default.asp

Google Maps API - https://developers.google.com/maps/documentation/javascript/
Open AQ - https://docs.openaq.org/

### To earn 55/75 points (grade: C):
- Show a map using the Google Maps API
  - Pan and zoom available with mouse click-and-drag and scroll wheel interaction 
  - Have an input box for a user to type a location
    - Map should update when location is entered
    - Input box text should update with new location (city name, lat/lon coordinates, ...) when map is panned
  - Populate a table with most up-to-date air quality measurements (from the Open AQ Platform API)
    - Table should automatically update data based on location shown in map
    - Should account for both center and zoom level
- "About the Project" page
  - Short bio about each team member (including a photo)
  - Description of the tools (frameworks, APIs, etc.) you used to create the application
  - Video demo of the application (2 - 4 minutes)
  - Can natively embed or upload to YouTube and embed
### To earn 65/75 points (grades B):
- Everything from the list above
- Create UI controls to filter data
    - Filter based on particle type
    - Filter based on measurement values for each particle type (eg. only show co > 1.3, ammonia > 72.9, ...)
    - Allow historical data to be retrieved
- Draw markers on the map at the location of each measurement
    - Create popup with actual measurement data when hovering over a marker
### To earn 75/75 points (grade A)
- Everything from the list above
- Use marker clusters for showing measurements
    - Markers should automatically split into individual markers when zoom level increases
Add option for showing a heatmap visualization overlay on the map when only one particle type selected
    - Color should represent the measurement value
    - Include easy-to-read legend
    - Do NOT use a rainbow color scale
- Allow map (along with the location input box) to go fullscreen