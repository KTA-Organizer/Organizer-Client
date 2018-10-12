import { API_URL } from "../constants";
const myStorage = window.localStorage;

// TODO change login mechanism
export const login = (username, password) =>
  processReq("/auth", { username, password }, "POST");

// TODO change logout
export const logout = () => myStorage.removeItem("token");

export const getCurrentUser = () => processReq("/currentUser", {}, "get");

export const getStudentsWithEdu = () =>
  processReq("/studentenMetOpleiding", {}, "get");

export const getStudent = () => processReq("/student", { id }, "get");

export const getOpleidingen = () => processReq("/opleidingen", {}, "get");

export const saveReport = () => processReq("/saveReport", report, "post");

export const updateReport = () => processReq("updateReport", report, "patch");

export const getFullOpleiding = id =>
  processReq("/fullOpleiding", { id }, "get");

export const getEvalForStudent = id =>
  processReq("/evaluatieVoorStudent", { id }, "get");

export const createUser = (firstname, lastname, email, pw, moduleIds, id) =>
  processReq(
    "/createUser",
    {
      firstname,
      lastname,
      email,
      pw,
      moduleIds,
      id
    },
    "post"
  );

export const updateUser = (firstname, lastname, email, pw, moduleIds, id) =>
  processReq(
    "/updateUser",
    {
      firstname,
      lastname,
      email,
      pw,
      moduleIds,
      id
    },
    "patch"
  );

export const createEval = evalJson =>
  processReq("/saveEvaluatie", evalJson, "post");

export const updateEval = evalJson =>
  processReq("/updateEvaluatie", evalJson, "post");

export const getEvalsByStudent = (modId, studId) =>
  processReq("/getEvaluatiesPerStudent", { modId, studId }, "get");

export const getAllEvalsByStudent = studId =>
  processReq("/studentAllEvaluationsFull", { studId }, "get");

export const deleteEval = id =>
  processReq("/deleteEvaluatie", { id }, "delete");

export const createOpleiding = (creatorId, name) =>
  processReq("/createOpleiding", { creatorId, name }, "post");

export const updateOpleiding = (opleidingId, name) =>
  processReq("/updateOpleiding", { opleidingId, name }, "patch");

export const createModule = (name, opleidingId, teacherId, creatorId) =>
  processReq(
    "/createModule",
    { name, opleidingId, teacherId, creatorId },
    "post"
  );

export const updateModule = (moduleId, name) =>
  processReq("/updateModule", { moduleId, name }, "patch");

export const createDoelstellingscategorie = (name, moduleId, creatorId) =>
  processReq(
    "/createDoelstellingscategorie",
    { name, moduleId, creatorId },
    "post"
  );

export const createDoelstelling = (name, doelstellingscategorieId, creatorId) =>
  processReq(
    "/createDoelstelling",
    {
      name,
      doelstellingscategorieId,
      creatorId
    },
    "post"
  );

export const updateDoelstelling = (doelstellingId, name) =>
  processReq(
    "/updateDoelstelling",
    {
      doelstellingId,
      name
    },
    "patch"
  );

async function processReq(url, dataObj, method) {
  try {
    const response = await fetch(`${API_URL}${url}`, {
      body: JSON.stringify(dataObj),
      method,
      credentials: "include",
      mode: "cors",
      cache: "no-cache",
      headers: {
        Accept: "application/json"
      }
    });
    if (response.ok) {
      try {
        return response.json();
      } catch (error) {
        return null;
      }
    } else {
      console.log(response.error);
      throw new Error(response.error);
    }
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong...");
  }
}
