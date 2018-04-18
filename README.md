# Web.Hftlmeier.Generictasks

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.7.3.

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Task generation
Tasks in this framework are generated dynamically from the `tasks.json` file stored under  `/src/assets`.  
This file stores information about one exercise with all its tasks.  
You can find a fully qualified example at the end of this documentation.  

The `tasks.json` file must have the following structure
#
```json
	{
		"name": "Example Exercise 1",
		"description": "The purpose of this exercise is to demonstrate how this framework wors.",
		"tasks": [
			"..."
		]
	}
```
`name` 		  - is the name of the exercise that is being displayed on the overview page  
`tasks` 	  - holds all the tasks of this exercise  
`description` - contains the description of what this exercise is about, its content and the purpose of the task  
#
Each task entry is considered to have the following child elements
#

```json
	{
		"id": 0, 
		"type": 0,
		"name": "Sample Task 1",
		"question": "Chose the correct answers from the right box and move them to the left box.",
		"maxpoints": 2,
		"reqpoints": 1,
		"data": {
			"..."
		}
	}
```
#
`id` - unique task id to identify the task  
`type` - is responsible for the type of the task and has to be between `0` and  `1`. You can find a table that maps the id to its corresponding taskname below.   
`name` - is the name/title of the task  
`question` - contains the actual question for this task. The String can html-formatted.  
`maxpoints` - the maximum points the user can get for this task  
`reqpoints` - the required amount of points the user need to continue with the next task   
#
```

| ID | TASKNAME             | 
|----|----------------------| 
| 0  |  Drag and Drop Task  | 
| 1  |  Naming Task         |
```
#
The `data` element is different for each task type. It basically contains specific information about this task such as an answers array, a collection with possible answers, etc.  
Here are the data elements described for all different tasktypes:  

**Drag and Drop Task**
```json
{
	"answers": [
        "This answers is a correct one",
    	"Another option to get a point"
    ],
	"possibleAnswers": [
        "This answers is a correct one",
        "Not all answers are correct",
    	"Another option to get a point",
    	"Guess what. Another wrong answer"
	]
}
```
`answers` - contains all the answers that are correct  
`possibleAnswers` - contains all possible answers that can be moved  

**Naming Task**
```json
{
	"answers": [
    	"Oh great! This one is correct.",
        "Another answer",
        "I'd chose this one"
	]
}
```
`answers` - contains all the answers that are correct

** Example **
```json
{
    "name": "First exercise",
    "description": "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
    "tasks": [
        {
            "id": 0,
            "type": 0,
            "name": "Task 1",
            "question": "Choose all your <b>favourite</b> fruits. Don't forget: you'll earn +1 point for each correct fruit and -1 point for every wrong fruit you pick.",
            "maxpoints": 2,
            "reqpoints": 1,
            "data": {
                "answers": [
                    "Apples",
                    "Bananas"
                ],
                "possibleAnswers": [
                    "Apples",
                    "Bananas",
					"Oranges",
					"Pear"
                ]
            }
        },
        {
            "id": 1,
            "type": 1,
            "name": "Task 2",
            "question": "You have learned a lot. Name all the task types that are available in this framework.",
            "maxpoints": 2,
            "reqpoints": 1,
            "data": {
                "answers": [
                    "Naming-Task",
					"DragAndDrop-Task"
                ]
            }
        }
    ]
}
```