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

export const getStudentsWithEdu = () => processReq("/studentModules"); // BROKEN

export const getStudentOpleiding = studId =>
    processReq(`/studentModules/${studId}`); // BROKEN

export const getStudent = id => processReq(`/students/${id}`); // BROKEN

export const getStudents = () => processReq('/users/', {/*role: "STUDENT"*/}, "get"); // BROKEN fix filter

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
            roles: user.roles
        },
        "put"
    ); // OK

export const assignOpleidingToUser = (disciplineid, userId) =>
    processReq(`/disciplines/student/${userId}`, { disciplineid }, "put"); // OK

export const getOpleidingen = () => processReq("/disciplines", {}, "get"); // OK

export const getOpleiding = id => processReq(`/disciplines/${id}`); // BROKEN

export const getOpleidingForStudent = id =>
    processReq(`/disciplines/student/${id}`, {}, "get"); // OK

export const saveReport = () => processReq("/saveReport", report, "post"); // NOT THERE YET

export const updateReport = () => processReq("/updateReport", report, "patch"); // NOT THERE YET

export const getFullOpleiding = id => processReq(`/modules`, { disciplineid: id }); // OK

export const getEvalForStudent = id =>
    processReq("/evaluatieVoorStudent", { id }, "get"); // NOT THERE YET

export const getModulesForStudent = studId =>
    processReq(`/modules/${studId}/student`); // ??

export const getModule = moduleId => processReq(`/modules/${moduleId}`); // OK

export const createEval = evalJson =>
    processReq("/saveEvaluatie", evalJson, "post"); // NOT THERE YET

export const updateEval = evalJson =>
    processReq("/updateEvaluatie", evalJson, "post"); // NOT THERE YET

export const getEvalsByStudent = studId =>
    processReq(`/evaluaties/${studId}/student`); // NOT THERE YET

export const getAllEvalsByStudent = studId =>
    processReq("/studentAllEvaluationsFull", { studId }, "get"); // NOT THERE YET

export const deleteEval = id =>
    processReq("/deleteEvaluatie", { id }, "delete"); // NOT THERE YET

export const createOpleiding = (creatorId, name) =>
    processReq("/disciplines", { creatorId, active: 1, name }, "post"); // OK

export const updateOpleiding = (opleidingId, name) =>
    processReq(`/disciplines/${opleidingId}`, { name }, "put"); // OK

export const createModule = (name, disciplineid) =>
    processReq("/modules", { name, disciplineid }, "post"); // OK

export const updateModule = (moduleId, name) =>
    processReq(`/modules/${moduleId}`, { name }, "put"); // OK

 export const createDomain = (name, moduleId, creatorId) =>
   processReq(
     "/doelstellingsCategorie",
     { name, moduleId, inGebruik: 1, creatorId },
     "post"
   ); // NOT THERE YET

// export const updateDoelstellingscategorie = (doelstellingscategorieId, name) =>
//   processReq(
//     "/doelstellingsCategorie/" + doelstellingscategorieId,
//     {
//       name
//     },
//     "put"
//   );  // NOT THERE YET

// export const createDoelstelling = (name, doelstellingscategorieId, creatorId) =>
//   processReq(
//     "/doelstellingen",
//     {
//       name,
//       doelstellingscategorieId,
//       inGebruik: 1,
//       creatorId
//     },
//     "post"
//   ); // NOT THERE YET

// export const updateDoelstelling = (doelstellingId, name) =>
//   processReq(
//     "/doelstellingen/" + doelstellingId,
//     {
//       name
//     },
//     "put"
//   ); // NOT THERE YET

// export const createCriteria = (name, doelstellingId, creatorId) =>
//   processReq(
//     "/evaluatieCriteria",
//     {
//       name,
//       doelstellingId,
//       inGebruik: 1,
//       gewicht: 1,
//       creatorId
//     },
//     "post"
//   ); // NOT THERE YET

// export const updateCriteria = (criteriaId, name) =>
//   processReq(
//     "/evaluatieCriteria/" + criteriaId,
//     {
//       name
//     },
//     "put"
//   ); // NOT THERE YET

// export const createAspect = (name, evaluatiecriteriumId, creatorId) =>
//   processReq(
//     "/aspecten",
//     {
//       name,
//       evaluatiecriteriumId,
//       inGebruik: 1,
//       gewicht: 1,
//       creatorId
//     },
//     "post"
//   );


// export const updateAspect = (aspectId, name) =>
//   processReq(
//     "/aspecten/" + aspectId,
//     {
//       name
//     },
//     "put"
//   );

export const setOpleidingInactive = (opleidingId) =>
    processReq(
        `/disciplines/${opleidingId}/status`,
        {
            active: 0
        },
        "put"
    ); // BROKEN

export const setOpleidingActive = (opleidingId) =>
    processReq(
        "/disciplines/" + opleidingId + "/status",
        {
            active: 1
        },
        "put"
    ); // BROKEN

// export const deleteCategorie = id =>
//     processReq("/doelstellingsCategorie/" + id, {}, "delete");

export const deleteModule = id =>
    processReq(`/modules/${id}`, {}, "delete"); // OK

// export const deleteDoelstelling = id =>
//     processReq("/doelstellingen/" + id, {}, "delete");

// export const deleteCriteria = id =>
//     processReq("/evaluatieCriteria/" + id, {}, "delete");

// export const deleteAspect = id =>
//     processReq("/aspecten/" + id, {}, "delete");

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
    } catch (error) { }
    if (response.ok) {
        return body;
    } else {
        throw new ResponseError(response.status, body);
    }
}
