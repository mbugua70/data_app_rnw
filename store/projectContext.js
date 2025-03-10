import { createContext, useReducer, useState, useEffect, act } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';


export const ProjectContext = createContext({
  projectsData: [],
  editedData: {},
  editDataHandler: (data) => {},
  formsData: [],
  setProjects: (projects)=> {},
  setForms: (formsData) => {},
  addFormSelects: (forms) => {},
  addForms: (formsData) => {},
  addProjects: (projects) => {},
  deleteProject: (id) => {},
  editProject: (id, project) => {},
  setFormNumber: (forms) => {},
  addFormInputs: (forms) => {},
  addFormInputsTwo: (inputs) => {},
  formInputData: [],
  formInputDataTwo: [],
  formsSelectData: [],
  records: [],
  addRecords: (record) => {}
});

// the use of Reducer function
function projectReducer(state, action) {
  switch (action.type) {
    case "ADD":
      // const id = new Date().toString() + Math.random().toString();
      return [ ...action.payload];
    case "ADDRECORDS":
      // const id = new Date().toString() + Math.random().toString();
      return [ ...action.payload];
    case "SET":
      const inverted = action.payload.reverse();
      return  inverted;
    case "DELETE":
      return state.filter((project) => project.id !== action.payload);
    case "UPDATE":
      const updatedIndex = state.findIndex(
        (expense) => expense.id === action.payload.id
      );

      const updatebleProject = state[updatedIndex];
      const updatedItem = { ...updatebleProject, ...action.payload.data };
      const updatedProjects = [...state];
      updatedProjects[updatedIndex] = updatedItem;
      return updatedProjects;
    default:
      return state;
  }
}

// formReducer
function formReducer(state, action) {
  switch (action.type) {
    case "ADDFORM":
      // const id = new Date().toString() + Math.random().toString();
      return [ ...action.payload];
    default:
      return state;
  }
}


function formNumberReducer(state, action) {
  switch (action.type) {
    case "SETFORMNUMBERS":
      return [...action.payload];
    default:
      return state;
  }
}

function formInputsReducer(state, action) {
  switch (action.type) {
    case "ADDINPUTFORMS":
      return state.map(form => {
        const updatedForm = action.payload.find(item => item.form_id === form.form_id);
        return updatedForm ? { ...form, inputs: updatedForm.inputs } : form;
      });
    default:
      return state;
  }
}

// function formInputsReducer (state, action) {
//   switch (action.type) {
//     case "ADDINPUTFORMS":
//       return [...action.payload];
//     default:
//       return state;
//   }
// }

function formInputsTwoReducer (state, action) {
  switch (action.type) {
    case "ADDINPUTFORMSTWO":
      if(state.length > 0) {
        return [...action.payload];
      }
    default:
      return state;
  }
}

function formSelectsReducer (state, action) {
   switch (action.type){
    case "ADDSELECT":
      return [...action.payload];
      default:
      return state;
   }
}

function formUserRecordsReducer(state, action){
  switch(action.type){
    case "ADDRECORDS":
      return [...action.payload];
      default:
      return state
  }
}

function editDataReducer(state, action){
  switch(action.type){
    case "ADDEDITDATA":
      return {...action.payload};
      default:
      return state
  }
}


function ProjectContextProvider({ children }) {
  const [projectsState, dispatch] = useReducer(projectReducer, []);
  const [formsState, dispatchForm] = useReducer(formReducer, []);
  const [formNumbersState, dispatchFormNumber] = useReducer(formNumberReducer, [])
  const [formInputsState, dispatchFormInputs] = useReducer(formInputsReducer, [])
  const [formSelectsState, dispatchFormSelect] = useReducer(formSelectsReducer, [])
  const [userRecordsState, dispatchUserRecords] = useReducer(formUserRecordsReducer, [])
  const [formInputStateTwo, dispatchFormInputTwo] = useReducer(formInputsTwoReducer, [])
  const [editDataState, dipatchEditData] = useReducer(editDataReducer, {})

  useEffect(() => {
    async function loadStoredData() {
      try {
        const projects = await AsyncStorage.getItem("projectsData");
        const forms = await AsyncStorage.getItem("formsData");
        const formNumbers = await AsyncStorage.getItem("formNumbers");
        const formInputs = await AsyncStorage.getItem("formInputData");
        const formInputsTwo = await AsyncStorage.getItem("formInputDataTwo");
        const formSelects = await AsyncStorage.getItem("formsSelectData");
        const formUserRecords = await AsyncStorage.getItem("formUserRecords")
        const editData = await AsyncStorage.getItem("editData")

        if (projects) dispatch({ type: "ADD", payload: JSON.parse(projects) });
        if (forms) dispatchForm({ type: "ADDFORM", payload: JSON.parse(forms) });
        if (formNumbers) dispatchFormNumber({ type: "SETFORMNUMBERS", payload: JSON.parse(formNumbers) });
        if (formInputs) dispatchFormInputs({ type: "ADDINPUTFORMS", payload: JSON.parse(formInputs) });
        if (formInputsTwo) dispatchFormInputTwo({ type: "ADDINPUTFORMSTWO", payload: JSON.parse(formInputs) });
        if (formSelects) dispatchFormSelect({ type: "ADDSELECT", payload: JSON.parse(formSelects) });
        if(formUserRecords) dispatchUserRecords({type: "ADDRECORDS", payload: JSON.parse(formUserRecords)});
        if(editData) dipatchEditData({type: "ADDEDITDATAA", payload: JSON.parse(editData)});
      } catch (error) {
        console.error("Error loading data:", error);
      }
    }

    loadStoredData();
  }, []);


  function addProjects(data) {
    dispatch({ type: "ADD", payload: data });
    AsyncStorage.setItem("projectsData", JSON.stringify(data))
  }

  function addForms(data){
   dispatchForm({type: "ADDFORM", payload: data})
   AsyncStorage.setItem("formsData", JSON.stringify(data))
  }

  function deleteProject(id) {
    dispatch({ type: "DELETE", payload: id });
  }

  function setProjects(project){
    dispatch({type: "SET", payload: project})
  }

  function editProject(id, data) {

    dispatch({ type: "UPDATE", payload: { id: id, data: data } });
  }

  function setFormNumber(data){
   dispatchFormNumber({type: "SETFORMNUMBERS", payload: data})
   AsyncStorage.setItem("formNumbers", JSON.stringify(data))
  }

  function addFormInputs (data){
   dispatchFormInputs({type: "ADDINPUTFORMS", payload: data})
   AsyncStorage.setItem("formInputData", JSON.stringify(data))
  }

  function addFormInputsTwo (inputs) {
   dispatchFormInputTwo({type: "ADDINPUTFORMSTWO", payload: inputs})
   AsyncStorage.setItem("formInputDataTwo", JSON.stringify(inputs))
  }

  function addFormSelects (data){
    dispatchFormSelect({type: "ADDSELECT", payload: data})
    AsyncStorage.setItem("formsSelectData", JSON.stringify(data))
  }

  function addRecords(data){
    dispatchUserRecords({type: "ADDRECORDS", payload: data})
    AsyncStorage.setItem("formUserRecords", JSON.stringify(data))
  }

  function editDataHandler(data) {
    dipatchEditData({type: "ADDEDITDATA", payload: data})
    AsyncStorage.setItem("editData", JSON.stringify(data))
  }

  const value = {
    addProjects: addProjects,
    deleteProject: deleteProject,
    editProject: editProject,
    setProjects: setProjects,
    projectsData: projectsState,
    formsData: formsState,
    addForms: addForms,
    setFormNumber: setFormNumber,
    formNumbers: formNumbersState,
    formInputData: formInputsState,
    addFormInputs: addFormInputs,
    formsSelectData: formSelectsState,
    addFormSelects: addFormSelects,
    addRecords: addRecords,
    records: userRecordsState,
    formInputDataTwo: formInputStateTwo,
    addFormInputsTwo: addFormInputsTwo,
    editedData: editDataState,
    editDataHandler: editDataHandler,
  };

  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  );
}

export default ProjectContextProvider;
