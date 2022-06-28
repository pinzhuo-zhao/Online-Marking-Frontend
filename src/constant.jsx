// Base URL
// const baseURL = 'http://localhost:8080/'
const baseURL = 'https://rapid-feedback-fe-redback.herokuapp.com/'

// Subject URL
export const getSubjectURL = baseURL+'api/subject/admin/getAllSubjects'
export const addSubjectURL = baseURL+'api/subject/admin/addSubject'
export const getSubjectNameURL = baseURL+'api/subject/getSubjectById/'
export const getMySubjectsURL = baseURL+'api/subject/getMySubjects'
export const deleteSubjectURL = baseURL+'api/subject/admin/deleteSubject/'

// Student URL
export const getCandidateURL = baseURL+'api/candidates/getAll/'
export const deleteCandidateURL = baseURL+'api/candidates/delete/'
export const addCandidateURL = baseURL+'api/candidates/addToSubject/'
export const addByCsvURL = baseURL+'api/candidates/addByCsv/'
export const getAvailableCandidatesForProjectURL = baseURL+'api/project/getAvailableCandidatesForProject/'
export const getIndividualCandidatesInProjectURL = baseURL+'api/project/getIndividualCandidatesInProject/'
export const addCandidateToProjectURL = baseURL+'api/project/addCandidateToProject/'
export const removeCandidateFromProjectURL = baseURL+'api/project/removeCandidateFromProject/'

// Tutor URL
export const getInstructorURL = baseURL+'api/user/coordinator/getAllTutors/'
export const addInstructorURL = baseURL+'api/user/coordinator/addTutor/'
export const addTutorByCsvURL = baseURL+'api/user/coordinator/addTutorByCsv/'
export const deleteTutorByIdURL = baseURL+'api/user/coordinator/deleteTutorById/'

// Template URL
export const createTemplateURL = baseURL + 'api/template/createTemplate/'
export const getTemplateURL = baseURL+'api/template/getAllTemplates/'
export const getTemplateByIdURL = baseURL+'api/template/getTemplateById/'
export const deleteTemplateURL = baseURL+'api/template/delete/'
export const updateTemplateURL = baseURL + 'api/template/updateTemplate'

// Rubric Item URL
export const getAllRubricItemsURL = baseURL + 'api/rubric/item/getRubricItems/all/'
export const createRubricItemURL = baseURL + 'api/rubric/item/createRubricItem/'
export const searchRubricItemsURL = baseURL + 'api/rubric/item/searchRubricItems/'
export const deleteRubricItemURL = baseURL + 'api/rubric/item/deleteRubricItem/'
export const addRubricItemByCsvURL = baseURL + 'api/rubric/item/addItemsByCsv/'
export const updateRubricItemURL = baseURL + 'api/rubric/item/updateRubricItem/'

// Rubric Subitem URL
export const getRubricSubitemsByIdURL = baseURL + 'api/rubric/subItem/getRubricSubItems/'

// Mark Setting URL
export const getMarkSettingURL = baseURL + 'api/rubric/markSetting/getMarkSetting/'

// Team URL
export const getTeamURL = baseURL+'api/team/getAllTeamsInSubject/'
export const deleteTeamURL = baseURL+'api/team/delete/'
export const getTeamByProjectURL = baseURL+'api/project/getAllTeamsInProject/'
export const createTeamURL = baseURL+'api/team/createTeam/'
export const editCandidatesInTeamURL = baseURL+'api/team/editCandidatesInTeam/'
export const getAvailableCandidatesForTeamURL = baseURL+'api/team/getAvailableCandidatesForTeam/'

// Project URL
export const getProjectURL = baseURL+'api/project/allProjects/'
export const deleteProjectURL = baseURL+'api/project/delete/'
export const createProjectURL = baseURL+'api/project/createProject'
export const connectTemplateToProjectURL = baseURL+'api/project/connectTemplateToProject/'
export const removeTeamFromProjectURL = baseURL+'api/project/removeTeamFromProject/'
export const showTemplateOfProjectURL = baseURL+'api/project/showTemplateOfProject/'
export const getAvailableTeamsForProjectURL = baseURL+'api/project/getAvailableTeamsForProject/'
export const addTeamsToProjectURL = baseURL+'api/project/addTeamsToProject/'

// Coordinator URL
export const getAllCoordinatorsURL = baseURL+'api/user/admin/getAllCoordinators'
export const findUserByEmailURL = baseURL+'api/user/findUserByEmail'
export const addCoordinatorURL = baseURL+'api/user/admin/addCoordinator/'
export const addCoordinatorAndSubjectURL = baseURL+'api/user/admin/addCoordinatorAndSubject'

// Feedback URL
export const teamSaveURL = baseURL+'api/feedback/team/save/'
export const personalSaveURL = baseURL+'api/feedback/personal/save/'
export const teamGeneralFeedbackURL = baseURL+'api/feedback/team/save/general/'
export const checkTeamURL = baseURL+'api/feedback/team/check/'
export const getTeamFeedbackURL = baseURL+'api/feedback/team/get/'
export const checkCandidateURL = baseURL+'api/feedback/candidate/check/'
export const studentSaveURL = baseURL+'api/feedback/candidate/save/'
export const studentGeneralSaveURL = baseURL+'api/feedback/candidate/save/general/'
export const getCandidateFeedbackURL = baseURL+'api/feedback/candidate/get/'

// Email URL
export const gradeListURL = baseURL+'api/email/csv/gradeList'
export const sendCandidatePDFMailURL = baseURL+'api/email/sendPDFMail/Candidate'
export const sendTeamPDFMailToCandidateURL = baseURL+'api/email/sendPDFMail/Team/ToCandidate'
export const sendTeamPDFMailToTutorURL = baseURL+'api/email/sendPDFMail/Team/ToTutor'

// Login URL
export const loginURL = baseURL+'login'
export const logoutURL = baseURL+'logout'
export const resetPasswordURL = baseURL + 'api/user/changePassword'
export const sendVerificationURL = baseURL + 'api/user/sendVerificationCode'