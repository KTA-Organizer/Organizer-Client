import { API_URL } from "../constants";
import { ResponseError } from "../utils/ResponseError";
const myStorage = window.localStorage;

export const login = (email, password) =>
  processReq("/auth/login", { email, password }, "POST");

export const logout = () => processReq("/auth/logout", {}, "POST");

export const getCurrentUser = () => processReq("/users/current", {}, "get");

export const getStudentsWithEdu = () =>
  processReq("/studentModules", {}, "get");

export const getStudentOpleiding = studId =>
  processReq(`/studentModules/${studId}`, {}, "get");

export const getStudents = () => processReq("/students", {}, "get");

export const getStudent = id => processReq(`/students/${id}`, {}, "get");

export const getUser = id => processReq(`/users/${id}`, {}, "get");

export const getOpleidingen = () => processReq("/opleidingen", {}, "get");

export const getOpleiding = id => processReq(`/opleidingen/${id}`, {}, "get");

export const saveReport = () => processReq("/saveReport", report, "post");

export const updateReport = () => processReq("/updateReport", report, "patch");

export const getFullOpleiding = id =>
  processReq(`/opleidingen/${id}/full`, {}, "get");

export const getEvalForStudent = id =>
  processReq("/evaluatieVoorStudent", { id }, "get");

export const getModulesForStudent = studId =>
  processReq(`/modules/${studId}/student`, {}, "get");

export const createStudent = (
  firstname,
  lastname,
  email,
  opleidingId,
  moduleIds
) =>
  processReq(
    "/students",
    {
      firstname,
      lastname,
      email,
      opleidingId,
      moduleIds
    },
    "post"
  );

export const updateStudent = (
  firstname,
  lastname,
  email,
  opleidingId,
  moduleIds,
  id
) =>
  processReq(
    `/students/${id}`,
    {
      firstname,
      lastname,
      email,
      opleidingId,
      moduleIds,
      id
    },
    "put"
  );

export const deleteStudent = id => processReq(`/students/${id}`, {}, "delete");

export const createEval = evalJson =>
  processReq("/saveEvaluatie", evalJson, "post");

export const updateEval = evalJson =>
  processReq("/updateEvaluatie", evalJson, "post");

export const getEvalsByStudent = studId =>
  processReq(`/evaluaties/${studId}/student`, {}, "get");

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

export const getMeldingen = () => processReq("/meldingen", {}, "get");

export const removeMelding = (id) => processReq(`/meldingen/${id}`, {}, "delete");

async function processReq(url, dataObj, method) {
  const conf = {
    method: method,
    credentials: "include",
    mode: "cors",
    cache: "no-cache"
  };
  if (method.toUpperCase() !== "GET") {
    conf.body = JSON.stringify(dataObj);
    conf.headers = {
      Accept: "application/json",
      "Content-Type": "application/json"
    };
  }

  const response = await fetch(`${API_URL}${url}`, conf);
  let body;
  try {
    body = await response.json();
  } catch (error) {}
  if (response.ok) {
    return body;
  } else {
    throw new ResponseError(response.status, body);
  }
}
