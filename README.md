Redux Script is a tool designed to automate the generation of Redux boilerplate code in both web and mobile applications. It simplifies the process of handling API requests and managing data within the Redux state.

Installation
You can install Redux Script Infra globally or locally within your React Native project.

Globally
npm install -g redux-script-infra

Locally 
npm install redux-script-infra



Usage
Globally Installed Package
When installed globally, you can use the bin commands directly with specific arguments.

Model
To generate a model, use the following command:

model 'jsonStringifiedObject' interfaceName path 
Replace 'jsonStringifiedObject' with the jsonStringified object representing the model and interfaceName with the name of the interface 
and path is where to want to generate that file 

Action
To generate an action, use the following command:

action name path rootActionName

Example -
action removeDiscount ./actions CartActions

Reducer
To generate a reducer, use the following command:

reducer name, path, rootReducerName

Example -
reducer removeDiscount ./reducers CartReducer

Epic
To generate an epic, use the following command:

epic name, path, rootEpicName

Example-
epic removeDiscount ./epics CartEpics 
 
Locally Installed Package
When installed locally, you can access the bin commands through the ".bin" directory within the project's "node_modules" folder.

Example 
./node_modules/.bin/model 'jsonStringifiedObject' interfaceName
Replace 'jsonStringifiedObject' with the jsonStringified object representing the model and interfaceName with the name of the interface.