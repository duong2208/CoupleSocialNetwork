const express = require('express');
const router = express.Router();
const couplesController = require('../controllers/CoupleController');
const { verifyAccessToken } = require('../middlewares/verifyToken');
const uploadCloud = require('../config/cloudinary.config');

router.get('/getCouple/:username', couplesController.getCouple);
router.get('/getCoupleByCurrentUser', verifyAccessToken, couplesController.getCoupleByCurrentUser);
router.get('/getCreatedUserByCouple/:createdUserId', couplesController.getCreateUserByCouple);
router.get('/getLoverUserByCouple/:loverUserId', couplesController.getLoverUserByCouple);
router.post('/sendInvitation/:email', verifyAccessToken, couplesController.sendInvitation);
router.get('/getCurrentInvitation', verifyAccessToken, couplesController.getCurrentInvitation);
router.delete('/cancelInvitation/:invitationId', verifyAccessToken, couplesController.cancelInvitation);
router.put('/acceptInvitation/:token', verifyAccessToken, couplesController.acceptInvitation);
router.put('/editInfoCouple/:coupleId', verifyAccessToken, uploadCloud.single('imageCouple'), couplesController.editInfoCouple);
router.patch('/editTempLoverUser/:coupleId', verifyAccessToken, uploadCloud.single('tempAvatarLover'), couplesController.editTempLoverUser);
router.patch('/followCouple/:coupleId', verifyAccessToken, couplesController.followCouple);
router.post('/disconnectConnection/:coupleId', verifyAccessToken, couplesController.disconnectConnection);
router.get('/getHistoryCoupleByCurrentUser', verifyAccessToken, couplesController.getHistoryCoupleByCurrentUser);
router.post('/inviteRestoreCouple/:coupleId', verifyAccessToken, couplesController.inviteRestoreCouple);
router.post('/acceptRestoreCouple/:invitationId', verifyAccessToken, couplesController.acceptRestoreCouple);
router.get('/getListInvitation', verifyAccessToken, couplesController.getListInvitation);
router.post('/acceptInvitationTwo/:invitationId', verifyAccessToken, couplesController.acceptInvitationTwo);
router.put('/editThemes/:coupleId', verifyAccessToken, uploadCloud.single('image'), couplesController.editThemes);

router.get('/searchCouple', verifyAccessToken, couplesController.searchCouple);
router.delete('/deleteHistoryCouple/:coupleId', verifyAccessToken, couplesController.deleteHistoryCouple);



module.exports = router;