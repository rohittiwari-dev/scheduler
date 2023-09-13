const CatchAsyncError = (fx) => {
	return (req, res, next) => {
		fx(req, res, next).catch(next);
	};
};
export default CatchAsyncError;
