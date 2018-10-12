import axios from "axios";
import { API_URL } from "../constants";

var myStorage = window.localStorage;
// myStorage.setItem('token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjIiLCJjbGVhcmFuY2UiOiJBRE1JTiJ9.a1lD/can5gzGUL4yki6CAZmdm4ucsInRXYatqzi4Pzk=')

var Api = (function() {
  var my = {};
  my.all = axios.all;
  my.spread = axios.spread;
  my.login = function(username, password, cb) {
    axios
      .post(API_URL + "/auth", {
        username: username,
        password: password
      })
      .then(function(response) {
        myStorage.setItem("token", response.data);
        window.location.href = "/#/home";
        return cb(response.data);
      })
      .catch(function(error) {
        console.log(error.response.data);
        return cb(error.response.data);
      });
  };

  my.validateToken = function(cb) {
    axios
      .post(API_URL + "/auth", {
        token: myStorage.getItem("token")
      })
      .then(function(response) {
        return cb(response.data);
      })
      .catch(function(error) {
        return cb(error.response.data);
      });
  };

  my.getCurrentUser = function(cb) {
    axios
      .get(API_URL + "/currentUser", {
        params: {
          token: myStorage.getItem("token")
        }
      })
      .then(function(response) {
        return cb(response.data);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  my.logout = function(cb) {
    myStorage.removeItem("token");
    return cb(myStorage.getItem("token"));
  };

  my.getStudentsWithEdu = function(callback) {
    axios
      .get(API_URL + "/studentenMetOpleiding", {
        params: {
          token: myStorage.getItem("token")
        }
      })
      .then(function(response) {
        return callback(response.data);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  my.getOpleidingen = function(callback) {
    axios
      .get(API_URL + "/opleidingen", {
        params: {
          token: myStorage.getItem("token")
        }
      })
      .then(function(response) {
        return callback(response.data);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  my.getStudent = function(id, cb) {
    axios
      .get(API_URL + "/student", {
        params: {
          id: id,
          token: myStorage.getItem("token")
        }
      })
      .then(function(response) {
        return cb(response.data);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  my.getStudentReports = function(id, cb) {
    axios
      .get(API_URL + "/studentReports", {
        params: {
          id: id,
          token: myStorage.getItem("token")
        }
      })
      .then(function(response) {
        return cb(response.data);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  my.getStudentReport = function(rapportid, cb) {
    axios
      .get(API_URL + "/studentReport", {
        params: {
          id: rapportid,
          token: myStorage.getItem("token")
        }
      })
      .then(function(response) {
        return cb(response.data);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  my.saveReport = function(report, cb) {
    axios
      .post(API_URL + "/saveReport", {
        commentaarAlgemeen: report.commentaarAlgemeen,
        commentaarKlassenraad: report.commentaarKlassenraad,
        commentaarWerkplaats: report.commentaarWerkplaats,
        enddate: report.enddate,
        modules: report.modules,
        name: report.name,
        startdate: report.startdate,
        studentId: report.studentId
      })
      .then(function(response) {
        if (response.statusText === "OK") return cb(response.data);
        else return cb(response.data);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  my.updateReport = function(report, cb) {
    axios
      .patch(API_URL + "/updateReport", {
        commentaarAlgemeen: report.commentaarAlgemeen,
        commentaarKlassenraad: report.commentaarKlassenraad,
        commentaarWerkplaats: report.commentaarWerkplaats,
        enddate: report.enddate,
        modules: report.modules,
        name: report.name,
        startdate: report.startdate,
        reportId: report.id,
        studentId: report.studentId
      })
      .then(function(response) {
        if (response.statusText === "OK") return cb(response.data);
        else return cb(response.data);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  my.getFullOpleiding = function(id, cb) {
    axios
      .get(API_URL + "/fullOpleiding", {
        params: {
          opleiding: id,
          token: myStorage.getItem("token")
        }
      })
      .then(function(response) {
        return cb(response.data);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  my.getEvalForStudent = function(id, cb) {
    axios
      .get(API_URL + "/evaluatieVoorStudent", {
        params: {
          id: id,
          token: myStorage.getItem("token")
        }
      })
      .then(function(response) {
        return cb(response.data);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  my.createUser = function(firstname, lastname, email, pw, moduleIds, id, cb) {
    axios
      .post(API_URL + "/createUser", {
        params: {
          firstname: firstname,
          lastname: lastname,
          email: email,
          pw: pw,
          moduleIds: moduleIds,
          id: id,
          token: myStorage.getItem("token")
        }
      })
      .then(function(response) {
        // console.log(resvar res = 'Student created'ponse)
        if (response.statusText === "OK") return cb(response.data);
        else return cb(response.data);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  my.updateUser = function(firstname, lastname, email, id, cb) {
    axios
      .patch(API_URL + "/updateUser", {
        firstname: firstname,
        lastname: lastname,
        email: email,
        id: id,
        token: myStorage.getItem("token")
      })
      .then(function(response) {
        if (response.statusText === "OK") return cb(response.data);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  my.createEval = function(evalJSON, cb) {
    axios
      .post(API_URL + "/saveEvaluatie", {
        aspecten: evalJSON.aspecten,
        name: evalJSON.name,
        studentId: evalJSON.studentId,
        moduleId: evalJSON.moduleId,
        date: evalJSON.date,
        token: myStorage.getItem("token")
      })
      .then(function(response) {
        if (response.statusText === "OK") return cb(response.data);
        else return cb(response.data);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  my.updateEval = function(evalJSON, cb) {
    axios
      .patch(API_URL + "/updateEvaluatie", {
        evalId: evalJSON.evalId,
        aspecten: evalJSON.aspecten,
        name: evalJSON.name,
        date: evalJSON.date,
        token: myStorage.getItem("token")
      })
      .then(function(response) {
        if (response.statusText === "OK") return cb(response.data);
        else return cb(response.data);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  my.getEvalsByStudent = function(modId, studId, cb) {
    axios
      .get(API_URL + "/getEvaluatiesPerStudent", {
        params: {
          modId: modId,
          studId: studId,
          token: myStorage.getItem("token")
        }
      })
      .then(function(response) {
        return cb(response.data);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  my.getAllEvalsByStudent = function(studId, cb) {
    axios
      .get(API_URL + "/studentAllEvaluationsFull", {
        params: {
          student: studId
        }
      })
      .then(function(response) {
        return cb(response.data);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  my.deleteEval = function(id, cb) {
    axios
      .delete(API_URL + "/deleteEvaluatie", {
        params: {
          id: id,
          token: myStorage.getItem("token")
        }
      })
      .then(function(response) {
        return cb(response.data);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  my.createOpleiding = function(creatorId, name, cb) {
    axios
      .post(API_URL + "/createOpleiding", {
        name: name,
        creatorId: creatorId
      })
      .then(function(response) {
        return cb(response);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  my.updateOpleiding = function(opleidingId, name, cb) {
    axios
      .patch(API_URL + "/updateOpleiding", {
        name: name,
        opleidingId: opleidingId
      })
      .then(function(response) {
        return cb(response);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  my.createModule = function(name, opleidingId, teacherId, creatorId, cb) {
    axios
      .post(API_URL + "/createModule", {
        name: name,
        opleidingId: opleidingId,
        teacherId: teacherId,
        creatorId: creatorId
      })
      .then(function(response) {
        console.log("REACHED CALLBACK");
        return cb(response);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  my.updateModule = function(moduleId, name, cb) {
    axios
      .patch(API_URL + "/updateModule", {
        name: name,
        moduleId: moduleId
      })
      .then(function(response) {
        return cb(response);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  my.createDoelstellingscategorie = function(name, moduleId, creatorId, cb) {
    axios
      .post(API_URL + "/createDoelstellingscategorie", {
        name: name,
        moduleId: moduleId,
        creatorId: creatorId
      })
      .then(function(response) {
        console.log("REACHED CALLBACK");
        return cb(response);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  my.updateDoelstellingscategorie = function(
    doelstellingscategorieId,
    name,
    cb
  ) {
    axios
      .patch(API_URL + "/updateDoelstellingscategorie", {
        name: name,
        doelstellingscategorieId: doelstellingscategorieId
      })
      .then(function(response) {
        return cb(response);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  my.createDoelstelling = function(
    name,
    doelstellingscategorieId,
    creatorId,
    cb
  ) {
    axios
      .post(API_URL + "/createDoelstelling", {
        name: name,
        doelstellingscategorieId: doelstellingscategorieId,
        creatorId: creatorId
      })
      .then(function(response) {
        return cb(response);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  my.updateDoelstelling = function(doelstellingId, name, cb) {
    axios
      .patch(API_URL + "/updateDoelstelling", {
        name: name,
        doelstellingId: doelstellingId
      })
      .then(function(response) {
        return cb(response);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  return my;
})();

export default Api;
