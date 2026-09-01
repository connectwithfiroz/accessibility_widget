use App\Http\Controllers\AuthenticateController;

Route::post('/generate-token', [AuthenticateController::class, 'generateToken']);
Route::post('/authenticate', [AuthenticateController::class, 'authenticate']);

