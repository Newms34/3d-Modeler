#CSS 3d Modeler
>A simple app that allows you to make cubes and cylinders and cones using css 3d. Make a scene, and then send it to your friends!
##Table of Contents:

 - [Explanation](#Explanation)
 - [Installation](#Installation)
 - [Use](#Use)
 - [FAQ](#FAQ)
 - [New Features](#New-Features)
 - [Upcoming Features](#Upcoming-Features)
 - [Author](#Author)

##Explanation 
>This is a simple 3d modeler written in just CSS, Angular, and other delicious JavaScripty things (mmm).

##Installation
 1. Run ```git clone https://github.com/Newms34/3d-Modeler.git```.
 2. Open ```tree.html```
 3. That's it!

##Use 
 1. Click Add an Object to create a new object. Make sure to name it! Note that clicking "See It!" activates preview mode.
 2. Click View Tree/Remove to view the scene tree and remove an object (currently bugs with this!).
 3. Click Save to get a fancy-looking code to save your scene.
 4. Click Load to post that fancy-looking code and see someone else's scene (oh boy, more bugs with this!).

##FAQ 
 Q: This doesn't work!
 
 A: 1.) That's not a question. 2.) Could you be more specific? Thanks.
 ----
 Q: I found a bug in ____. Should I report it?
 
 A: Sure! Leave a comment here, and I'll see what I can do!
 ----
 Q: This is too difficult to use! What do I do?
 
 A: I've rewritten the UI a few times, but I'm definitely still working on it! Feel free to send me your suggestions.
 ----
 Q: Why CSS/Angular? Why not ThreeJS?
 
 A: While it's true that ThreeJS and other JS libraries are pretty awesome, and can do most of the stuff I'm doing here easily, this is an experiment: what can we do with pure CSS?
 
 ----
 Q: Why no spheres? 
 
 A: High-poly objects such as spheres are difficult to draw and require a lot of processor power. I may include them later, but for now, being nice requires I don't overwork your computers.
 
 ----
 Q: Why do cones not allow textures?
 
 A: Because of the way triangles are drawn with CSS (hint: it's already a bit of a trick)<sup>*</sup>, the triangles can't really have background textures. Sorry!

##New Features
 - Updated object textures. Objects materials can now glow, be transparent, be shiny, and have image textures (except for cones).
 - Background texture options. No longer just have a boring plain-white background!
 - Scene Filters! Give your entire scene a sepia tone, or play with the contrast!
 - You can now name your scene.
 - Backgrounds included in loaded scenes!
 - Names included in loaded scenes!
 - New Movement Modes: During object creation, you can specify what the mouse does to an object!
 - Press R to toggle normal Rotation Mode. 
 - Press M to toggle Custom Movement Mode. 

##Upcoming Features
 - Stay tuned!
 
##Author 
 - [Me (David Newman)](https://github.com/Newms34);

Footnotes
 1. Basically, think of a framed picture. The borders of the picture - the frame sides - are trapezoids. To make a triangle, we make the size of the actual "picture" in our example 0x0 - i.e., non-existant. We then define the bottom border as our desired color, and the left and right borders as transparent. The result? An upwards-pointing triangle
