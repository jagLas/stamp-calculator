# Stamp Calculator

## About this project
This project is to create a small program that will take a collection of stamps with their values, and it will calculate which stamps you should use to get as close to the given postage as possible without going under.

## Why?
My mom had a huge, random assortment of different stamps and for the life of her could not figure out the best way to combine them to get proper postage. I wrote this to make her life easier.

## How to run it
This currently needs to be run using node. It was written and tested on node v16.17.1. There is currently no ui for this program.

## To-do
- More rigorous testing
- ~~Add a UI.~~
- Add checks and code to prevent negative numbers
- Add warnings for larger inventory size calculations
- tweak positiong and responsive design of ui
- Add sorting
  - add a sort function for inventory
  - auto sort inventory on html
- add ability to delete stamps:
  - add a delete function for stamp
  - add delete button to html
- make code more efficient
  - write unit tests for functions
  - change algorithm to return first found