import { API_URL } from "../constants/config";
import { ResponseError } from "../utils/ResponseError";

export const login = (email, password) =>
  processReq("/auth/login", { email, password }, "POST"); // OK

export const logout = () => processReq("/auth/logout", {}, "POST"); // OK

export const requestPasswordReset = email =>
  processReq("/auth/forgot", { email }, "post"); // OK

export const putNewPassword = (token, password) =>
  processReq(`/auth/token/${token}`, { password }, "put"); // OK

export const getAccessToken = token => processReq(`/auth/token/${token}`); // OK

export const getCurrentUser = () => processReq("/users/current"); // OK

export const getStudents = () =>
  processReq("/users/", { role: "STUDENT" }, "get"); // OK

export const getUser = id => processReq(`/users/${id}`); // OK

export const paginateUsers = ({
  page,
  perPage,
  role,
  gender,
  status,
  search
}) =>
  processReq(
    "/users",
    {
      page,
      perpage: perPage,
      role,
      gender,
      status,
      search
    },
    "get"
  ); // OK

export const createUser = newUser => processReq("/users", newUser, "post"); // OK

export const deleteUser = id => processReq(`/users/${id}`, {}, "delete"); // OK

export const activateUser = id =>
  processReq(`/users/${id}/activate`, {}, "put"); // OK

export const updateUser = user =>
  processReq(
    `/users/${user.id}`,
    {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      gender: user.gender,
      roles: user.roles,
      nationalRegisterNumber: user.nationalRegisterNumber
    },
    "put"
  ); // OK

export const assignDisciplineToUser = (disciplineid, userId) =>
  processReq(`/disciplines/student/${userId}`, { disciplineid }, "put"); // OK

export const getDisciplines = () => processReq("/disciplines", {}, "get"); // OK

export const getDisciplineForStudent = id =>
  processReq(`/disciplines/student/${id}`, {}, "get"); // OK

export const getReportPDF = reportid => processReq(`/reports/pdf/${reportid}`);

export const paginateReports = (page, perpage, filters = {}) =>
  {
    return processReq(`/reports`, { page, perpage, ...filters });
  }

export const getReport = id => processReq(`/reports/${id}`);

export const saveReportComments = (id, { generalComment, goalComments }) =>
  processReq(`/reports/${id}`, { generalComment, goalComments }, "PUT");

export const openReport = id => processReq(`/reports/${id}/open`, {}, "POST");

export const createReport = evaluationsheetid =>
  processReq(`/reports`, { evaluationsheetid }, "POST");

export const getDiscipline = id => processReq(`/disciplines/${id}`); // OK

export const getModulesForDiscipline = id =>
  processReq(`/modules`, { disciplineid: id }); // OK

export const getStudentsForDiscipline = disciplineid =>
  processReq("/users/", { role: "STUDENT", disciplineid }, "get"); // OK

export const getModulesForStudent = studId =>
  processReq(`/modules/${studId}/student`); // ??

export const getModule = moduleId => processReq(`/modules/${moduleId}`); // OK

export const saveEvaluation = (id, scores) =>
  processReq(`/evaluations/${id}`, { scores }, "put"); // OK

export const getEvaluationSheetsForStudentInModule = (studentid, moduleid) =>
  processReq(
    `/evaluations`,
    { studentid: studentid, moduleid: moduleid },
    "get"
  ); // OK

export const getEvaluationSheetById = evalId =>
  processReq(`/evaluations/${evalId}`);

export const endEvaluation = evalId =>
  processReq(`/evaluations/${evalId}`, {}, "delete");

export const createNewEvaluation = (studentid, moduleid, startdate, periodname) =>
  processReq(`/evaluations`, { studentid, moduleid, startdate, periodname }, "post");

export const createDiscipline = name =>
  processReq("/disciplines", { name }, "post"); // OK

export const updateDiscipline = (opleidingId, name) =>
  processReq(`/disciplines/${opleidingId}`, { name }, "put"); // OK

export const createModule = (name, disciplineid) =>
  processReq("/modules", { name, disciplineid }, "post"); // OK

export const updateModule = (moduleId, name) =>
  processReq(`/modules/${moduleId}`, { name }, "put"); // OK

export const createDomain = (name, moduleid) =>
  processReq("/domains", { moduleid, name }, "post");

export const setDomainInactive = domainid =>
  processReq(
    `/domains/${domainid}/status`,
    {
      active: 0
    },
    "put"
  );

export const setGoalInactive = goalid =>
  processReq(
    `/goals/${goalid}/status`,
    {
      active: 0
    },
    "put"
  );

export const setCriteriaInactive = criteriaid =>
  processReq(
    `/criteria/${criteriaid}/status`,
    {
      active: 0
    },
    "put"
  );

export const updateDomain = (domainId, name) =>
  processReq(
    "/domains/" + domainId,
    {
      name
    },
    "put"
  );

export const createGoal = (name, domainid) =>
  processReq(
    "/goals",
    {
      domainid,
      name
    },
    "post"
  );

export const updateGoal = (goalId, name) =>
  processReq(
    "/goals/" + goalId,
    {
      name
    },
    "put"
  );

export const createCriteria = (name, weight, goalid) =>
  processReq(
    "/criteria",
    {
      name,
      goalid,
      weight
    },
    "post"
  );

export const updateCriteria = (criteriaId, name) =>
  processReq(
    "/criteria/" + criteriaId,
    {
      name
    },
    "put"
  );

export const setDisciplineInactive = opleidingId =>
  processReq(
    `/disciplines/${opleidingId}/status`,
    {
      active: 0
    },
    "put"
  ); // OK

export const setDisciplineActive = opleidingId =>
  processReq(
    "/disciplines/" + opleidingId + "/status",
    {
      active: 1
    },
    "put"
  ); // OK

export const deleteModule = id => processReq(`/modules/${id}`, {}, "delete"); // OK

export const getMeldingen = () => processReq("/meldingen"); // OK

export const createMelding = meldingObj =>
  processReq("/meldingen", meldingObj, "post"); // OK

export const removeMelding = id => processReq(`/meldingen/${id}`, {}, "delete"); // OK

async function processReq(url, dataObj = {}, method = "GET") {
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
  } else {
    const queryString = Object.keys(dataObj)
      .filter(key => !!dataObj[key])
      .map(key => `${key}=${dataObj[key]}`)
      .join("&");
    if (queryString.length > 1) {
      url += `?${queryString}`;
    }
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
