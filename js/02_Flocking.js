/*
 * @name Flocking
 * @description Demonstration of Craig Reynolds' "Flocking" behavior.
 * See: http://www.red3d.com/cwr/
 * Rules: Cohesion, Separation, Alignment
 * (from <a href="http://natureofcode.com">natureofcode.com</a>).
 *  Drag mouse to add boids into the system.
 */


let flock;
let W;
let H;
let notes = [];
let colors = ['chartreuse', 'turquoise', 'orange', 'hotpink'];
let hover_colors = ['lightgreen', 'lightblue', 'yellow', 'pink'];
let proj_names = ['LEAST<br>CONCERN',
			 'IPHONE<br>',
			 'CARD<br>CATALOG',
			 'LONESOME<br>GEORGE',
			 'KARIBA<br>DAM',
			 'SEED<br>ARCHIVE',
			 'KIRIBATI<br>',
			 'GIANT<br>PANDA',
			 'GARLIC<br>MUSTARD',
			 'EASTERN<br>TIMBER<br>WOLF',
			 'ABOUT<br>'];
let links = [];


function setup() {
  W=windowWidth-windowWidth/30;
  H=windowHeight-windowHeight/30;
  bg = loadImage('/resilience-repository/media/Homepagetes5.jpg');

  setupLinks(); // instantiate list of links

  flock = new Flock();
  // Add an initial set of boids into the system
  for (let i = 0; i < 100; i++) {
    let b = new Boid(width / 2,height / 2);
    flock.addBoid(b);
  }
}

function draw() {
  W=windowWidth-windowWidth/30; // modular padding
  H=windowHeight-windowHeight/30;
  createCanvas (W, H);
  background(bg);

  // draw sticky notes 
  drawNotes();

  // add prompt to draw boids under sticky notes
  textSize(width / 60);
  textAlign(CENTER);
  fill('#666');
  text('Click and drag anywhere in the window to add to the flock.', W/2, H-H/16);



  flock.run();
}

/**
 * Functions for drawing clickable link
 * sticky notes.
 * START
 **/

function Note(x, y, w, h, color, link) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.color = color;
	this.link = link;
}

Note.prototype.draw = function() {
	noStroke();
	fill(this.color);
	rect(this.x, this.y, this.w, this.h);
}

function setupNotes() {
	let rectX = W/4;
	let rectY = H-H/3.5;
	let rectW = W/15;
	let rectH = H/10;
	let color;
	let linkX;
	let linkY;
	let fwl; /* first word length */
	for(let i = 0; i < 11; i++) {
		if(i == 10) {
			rectX = W/2.48;
			rectY = H-H/2.15;
		}
		notes[i] = new Note(rectX, rectY, rectW, rectH, 
							color=colorCheck(rectX, rectY, rectW, rectH, i), link=links[i]);
		fwl=getFirstWordLength(proj_names[i]);	
		notes[i].link.style('font-size: '+ (rectW) + '%;'); 
		linkX = rectX + (rectW/6);
		linkY = rectY + rectH/3;
		notes[i].link.position(linkX, linkY);
		// notes[i].link.size(rectW, rectH);
		rectX+=rectW+3;
	}
}

function getFirstWordLength(string) {
	let i = 0;
	let newWord = [];
	while(string[i] != '<') {
		newWord[i] = string[i];
		i++;
	}
	return (textWidth(newWord)-textWidth(newWord[0])-textWidth(newWord[1]));
}
		

function colorCheck(x, y, w, h, i) {
	let d = dist(mouseX, mouseY, x+w/2, y+h/2);
	if(d < 25) { return hover_colors[i%4]; }
	else { return colors[i%4]; }
}

// sets up links !ONLY TO BE CALLED ONCE!
function setupLinks() {
	for(let i = 0; i < 11; i++) {
		if(i == 10) { 
			links[i] = createA('/resilience-repository/about.html', proj_names[i]);
		}
		else {
			links[i] = createA('/resilience-repository/projects/proj'+i+'.html', proj_names[i]);
		}
	}
}

function drawNotes() {
	setupNotes();
	for(let i = 0; i < 11; i++) {
		notes[i].draw();
	}
}

/**
 * END
 **/

// Add a new boid into the System
function mouseDragged() {
  flock.addBoid(new Boid(mouseX, mouseY));
}

// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Flock object
// Does very little, simply manages the array of all the boids

function Flock() {
  // An array for all the boids
  this.boids = []; // Initialize the array
}

Flock.prototype.run = function() {
  for (let i = 0; i < this.boids.length; i++) {
    this.boids[i].run(this.boids);  // Passing the entire list of boids to each boid individually
  }
}

Flock.prototype.addBoid = function(b) {
  this.boids.push(b);
}

// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Boid class
// Methods for Separation, Cohesion, Alignment added

function Boid(x, y) {
  this.acceleration = createVector(0, 0);
  this.velocity = createVector(random(-1, 1), random(-1, 1));
  this.position = createVector(x, y);
  this.r = 3.0;
  this.maxspeed = 3;    // Maximum speed
  this.maxforce = 0.05; // Maximum steering force
}

Boid.prototype.run = function(boids) {
  this.flock(boids);
  this.update();
  this.borders();
  this.render();
}

Boid.prototype.applyForce = function(force) {
  // We could add mass here if we want A = F / M
  this.acceleration.add(force);
}

// We accumulate a new acceleration each time based on three rules
Boid.prototype.flock = function(boids) {
  let sep = this.separate(boids);   // Separation
  let ali = this.align(boids);      // Alignment
  let coh = this.cohesion(boids);   // Cohesion
  // Arbitrarily weight these forces
  sep.mult(1.5);
  ali.mult(1.0);
  coh.mult(1.0);
  // Add the force vectors to acceleration
  this.applyForce(sep);
  this.applyForce(ali);
  this.applyForce(coh);
}

// Method to update location
Boid.prototype.update = function() {
  // Update velocity
  this.velocity.add(this.acceleration);
  // Limit speed
  this.velocity.limit(this.maxspeed);
  this.position.add(this.velocity);
  // Reset accelertion to 0 each cycle
  this.acceleration.mult(0);
}

// A method that calculates and applies a steering force towards a target
// STEER = DESIRED MINUS VELOCITY
Boid.prototype.seek = function(target) {
  let desired = p5.Vector.sub(target,this.position);  // A vector pointing from the location to the target
  // Normalize desired and scale to maximum speed
  desired.normalize();
  desired.mult(this.maxspeed);
  // Steering = Desired minus Velocity
  let steer = p5.Vector.sub(desired,this.velocity);
  steer.limit(this.maxforce);  // Limit to maximum steering force
  return steer;
}

Boid.prototype.render = function() {
  // Draw a triangle rotated in the direction of velocity
  let theta = this.velocity.heading() + radians(90);
  fill(127);
  stroke(200);
  push();
  translate(this.position.x, this.position.y);
  rotate(theta);
  beginShape();
  vertex(0, -this.r * 2);
  vertex(-this.r, this.r * 2);
  vertex(this.r, this.r * 2);
  endShape(CLOSE);
  pop();
}

// Wraparound
Boid.prototype.borders = function() {
  if (this.position.x < -this.r)  this.position.x = width + this.r;
  if (this.position.y < -this.r)  this.position.y = height + this.r;
  if (this.position.x > width + this.r) this.position.x = -this.r;
  if (this.position.y > height + this.r) this.position.y = -this.r;
}

// Separation
// Method checks for nearby boids and steers away
Boid.prototype.separate = function(boids) {
  let desiredseparation = 25.0;
  let steer = createVector(0, 0);
  let count = 0;
  // For every boid in the system, check if it's too close
  for (let i = 0; i < boids.length; i++) {
    let d = p5.Vector.dist(this.position,boids[i].position);
    // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
    if ((d > 0) && (d < desiredseparation)) {
      // Calculate vector pointing away from neighbor
      let diff = p5.Vector.sub(this.position, boids[i].position);
      diff.normalize();
      diff.div(d);        // Weight by distance
      steer.add(diff);
      count++;            // Keep track of how many
    }
  }
  // Average -- divide by how many
  if (count > 0) {
    steer.div(count);
  }

  // As long as the vector is greater than 0
  if (steer.mag() > 0) {
    // Implement Reynolds: Steering = Desired - Velocity
    steer.normalize();
    steer.mult(this.maxspeed);
    steer.sub(this.velocity);
    steer.limit(this.maxforce);
  }
  return steer;
}

// Alignment
// For every nearby boid in the system, calculate the average velocity
Boid.prototype.align = function(boids) {
  let neighbordist = 50;
  let sum = createVector(0,0);
  let count = 0;
  for (let i = 0; i < boids.length; i++) {
    let d = p5.Vector.dist(this.position,boids[i].position);
    if ((d > 0) && (d < neighbordist)) {
      sum.add(boids[i].velocity);
      count++;
    }
  }
  if (count > 0) {
    sum.div(count);
    sum.normalize();
    sum.mult(this.maxspeed);
    let steer = p5.Vector.sub(sum, this.velocity);
    steer.limit(this.maxforce);
    return steer;
  } else {
    return createVector(0, 0);
  }
}

// Cohesion
// For the average location (i.e. center) of all nearby boids, calculate steering vector towards that location
Boid.prototype.cohesion = function(boids) {
  let neighbordist = 50;
  let sum = createVector(0, 0);   // Start with empty vector to accumulate all locations
  let count = 0;
  for (let i = 0; i < boids.length; i++) {
    let d = p5.Vector.dist(this.position,boids[i].position);
    if ((d > 0) && (d < neighbordist)) {
      sum.add(boids[i].position); // Add location
      count++;
    }
  }
  if (count > 0) {
    sum.div(count);
    return this.seek(sum);  // Steer towards the location
  } else {
    return createVector(0, 0);
  }
}

