import { API_URL } from "../constants";
import { ResponseError } from "../utils/ResponseError";
const myStorage = window.localStorage;

export const login = (email, password) =>
  processReq("/auth/login", { email, password }, "POST");

export const logout = () => processReq("/auth/logout", {}, "POST");

export const putNewPassword = (token, password) => processReq(`/auth/token/${token}`, { password }, "put");

export const getAccessToken = (token) => processReq(`/auth/token/${token}`);

export const getCurrentUser = () => processReq("/users/current");

export const getStudentsWithEdu = () =>
  processReq("/studentModules");

export const getStudentOpleiding = studId =>
  processReq(`/studentModules/${studId}`);

export const getStudents = () => processReq("/students");

export const getStudent = id => processReq(`/students/${id}`);

export const getUser = id => processReq(`/users/${id}`);

export const getOpleidingen = () => processReq("/opleidingen");

export const getOpleiding = id => processReq(`/opleidingen/${id}`);

export const saveReport = () => processReq("/saveReport", report, "post");

export const updateReport = () => processReq("/updateReport", report, "patch");

export const getFullOpleiding = id =>
  processReq(`/opleidingen/${id}/full`);

export const getEvalForStudent = id =>
  processReq("/evaluatieVoorStudent", { id }, "get");

export const getModulesForStudent = studId =>
  processReq(`/modules/${studId}/student`);

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
  processReq(`/evaluaties/${studId}/student`);

export const getAllEvalsByStudent = studId =>
  processReq("/studentAllEvaluationsFull", { studId }, "get");

export const deleteEval = id =>
  processReq("/deleteEvaluatie", { id }, "delete");

export const createOpleiding = (creatorId, name) =>
  processReq("/opleidingen", { creatorId, active: 1, name }, "post");

export const updateOpleiding = (opleidingId, name) =>
  processReq("/opleidingen/" + opleidingId, { name }, "put");

export const createModule = (name, opleidingId, teacherId, creatorId) =>
  processReq(
    "/modules",
    { name, opleidingId, teacherId, creatorId },
    "post"
  );

export const updateModule = (moduleId, name) =>
  processReq("/modules/" + moduleId, { name }, "put");

export const createDoelstellingscategorie = (name, moduleId, creatorId) =>
  processReq(
    "/doelstellingsCategorie",
    { name, moduleId, inGebruik: 1, creatorId },
    "post"
  );

  export const updateDoelstellingscategorie = (doelstellingscategorieId, name) =>
  processReq(
    "/doelstellingsCategorie/" + doelstellingscategorieId,
    {
      name
    },
    "put"
  );

export const createDoelstelling = (name, doelstellingscategorieId, creatorId) =>
  processReq(
    "/doelstellingen",
    {
      name,
      doelstellingscategorieId,
      inGebruik: 1,
      creatorId
    },
    "post"
  );

export const updateDoelstelling = (doelstellingId, name) =>
  processReq(
    "/doelstellingen/" + doelstellingId,
    {
      name
    },
    "put"
  );

  export const createCriteria = (name, doelstellingId, creatorId) =>
  processReq(
    "/evaluatieCriteria",
    {
      name,
      doelstellingId,
      inGebruik: 1,
      gewicht: 1,
      creatorId
    },
    "post"
  );

export const updateCriteria = (criteriaId, name) =>
  processReq(
    "/evaluatieCriteria/" + criteriaId,
    {
      name
    },
    "put"
  );

  export const createAspect = (name, criteriaId, creatorId) =>
  processReq(
    "/aspecten",
    {
      name,
      criteriaId,
      inGebruik: 1,
      gewicht: 1,
      creatorId
    },
    "post"
  );

export const updateAspect = (aspectId, name) =>
  processReq(
    "/aspecten/" + aspectId,
    {
      name
    },
    "put"
  );


export const getMeldingen = () => processReq("/meldingen");

export const createMelding = (meldingObj) => processReq("/meldingen", meldingObj, "post");

export const removeMelding = (id) => processReq(`/meldingen/${id}`, {}, "delete");

async function processReq(url, dataObj={}, method="GET") {
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
