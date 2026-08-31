<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Carbon\Carbon;

class AuthenticateController extends Controller
{
    private string $jwtSecret;
    private string $allowedHost;

    public function __construct()
    {
        $this->jwtSecret = config('services.jwt.secret', env('JWT_KEY'));
        $this->allowedHost = config('services.acs.allowed_host', env('ACS_ALLOWED_HOST'));
    }

    /**
     * Generate a new long-lived JWT token tied to a domain.
     * Note: Restrict route access to authorized admins only.
     */
    public function generateToken(Request $request): JsonResponse
    {
        $domain = 'https://gvc.gujarat.gov.in';
        $issuedAt = Carbon::now();
        $expirationTime = $issuedAt->copy()->addYears(20);

        $payload = [
            'iat' => $issuedAt->timestamp,
            'nbf' => $issuedAt->timestamp,
            'exp' => $expirationTime->timestamp,
            'domain' => base64_encode($domain),
        ];

        $jwt = JWT::encode($payload, $this->jwtSecret, 'HS256');

        return response()->json([
            'success' => true,
            'status' => 'success',
            'message' => "New Secret Key Generated for domain- {$domain}",
            'token' => $jwt,
            'issued_at' => $issuedAt->toDateTimeString(),
            'expiration_time' => $expirationTime->toDateTimeString(),
            'status_code' => 200,
        ], 200);
    }

    /**
     * Validate the domain-bound JWT token and return HTML/Widget payloads.
     */
    public function authenticate(Request $request): JsonResponse
    {
        // 1. Request Validation (Laravel built-in)
        $validator = Validator::make($request->all(), [
            'token' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Token field is required',
                'success' => false,
                'status' => 'failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        // 2. Logging Metadata
        $requestingDomain = $request->headers->get('origin') 
            ?? $request->headers->get('referer') 
            ?? 'Unknown Domain';

        // Extract scheme + host if referer was used
        if ($requestingDomain !== 'Unknown Domain' && filter_var($requestingDomain, FILTER_VALIDATE_URL)) {
            $parsed = parse_url($requestingDomain);
            $requestingDomain = ($parsed['scheme'] ?? 'http') . '://' . ($parsed['host'] ?? '');
        }

        $logData = [
            'HTTP_HOST' => $request->getHost(),
            'REMOTE_ADDR' => $request->ip(),
            'USER_AGENT' => $request->userAgent(),
            'REQUESTING_DOMAIN' => $requestingDomain,
        ];

        Log::info("ACCESSABILITY ==> TOKEN VALIDATION SUCCESS", $logData);

        // 3. Verify JWT Token
        try {
            $decoded = JWT::decode($request->input('token'), new Key($this->jwtSecret, 'HS256'));
            $tokenDomain = isset($decoded->domain) ? base64_decode($decoded->domain) : '';
        } catch (\Exception $e) {
            Log::warning("ACCESSABILITY ==> TOKEN VALIDATION FAILED: " . $e->getMessage(), $logData);

            return response()->json([
                'message' => 'TOKEN VALIDATION FAILED',
                'success' => false,
                'status' => 'failed',
            ], 401);
        }

        // 4. Domain Authorization Checks
        if ($requestingDomain !== $tokenDomain || $tokenDomain !== $this->allowedHost) {
            Log::warning("ACCESSABILITY ==> INVALID TOKEN DOMAIN DATA", [
                'tokenDomain' => $tokenDomain,
                'requestingDomain' => $requestingDomain,
                'allowedHost' => $this->allowedHost
            ]);

            return response()->json([
                'message' => "INVALID TOKEN DATA tokenfor = {$tokenDomain}, requestingfrom = {$requestingDomain}",
                'success' => false,
                'status' => 'failed',
            ], 403);
        }

        // 5. Successful Response Payload
        return response()->json([
            'message' => 'Token validated',
            'accessabilityBtnText' => $this->getAccessibilityBtnHtml(),
            'widgetSection' => $this->getWidgetSectionHtml(),
            'success' => true,
            'status' => 'success',
            'status_code' => 200,
        ], 200);
    }

    /**
     * Extracted HTML template for accessibility button.
     */
    private function getAccessibilityBtnHtml(): string
    {
        return "<img  class='accessability-f_item__name'  src='data:image/svg+xml,%0A%3Csvg width='32' height='32' viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg clip-path='url(%23clip0_1_1506)'%3E%3Cpath d='M16 7C15.3078 7 14.6311 6.79473 14.0555 6.41015C13.4799 6.02556 13.0313 5.47894 12.7664 4.83939C12.5015 4.19985 12.4322 3.49612 12.5673 2.81719C12.7023 2.13825 13.0356 1.51461 13.5251 1.02513C14.0146 0.535644 14.6383 0.202301 15.3172 0.0672531C15.9961 -0.0677952 16.6999 0.00151652 17.3394 0.266423C17.9789 0.53133 18.5256 0.979934 18.9101 1.55551C19.2947 2.13108 19.5 2.80777 19.5 3.5C19.499 4.42796 19.1299 5.31762 18.4738 5.97378C17.8176 6.62994 16.928 6.99901 16 7Z' fill='white'/%3E%3Cpath d='M27 7.05L26.9719 7.0575L26.9456 7.06563C26.8831 7.08313 26.8206 7.10188 26.7581 7.12125C25.595 7.4625 19.95 9.05375 15.9731 9.05375C12.2775 9.05375 7.14313 7.67875 5.50063 7.21188C5.33716 7.14867 5.17022 7.09483 5.00063 7.05063C3.81313 6.73813 3.00063 7.94438 3.00063 9.04688C3.00063 10.1388 3.98188 10.6588 4.9725 11.0319V11.0494L10.9238 12.9081C11.5319 13.1413 11.6944 13.3794 11.7738 13.5856C12.0319 14.2475 11.8256 15.5581 11.7525 16.0156L11.39 18.8281L9.37813 29.84C9.37188 29.87 9.36625 29.9006 9.36125 29.9319L9.34688 30.0112C9.20188 31.0206 9.94313 32 11.3469 32C12.5719 32 13.1125 31.1544 13.3469 30.0037C13.5813 28.8531 15.0969 20.1556 15.9719 20.1556C16.8469 20.1556 18.6494 30.0037 18.6494 30.0037C18.8838 31.1544 19.4244 32 20.6494 32C22.0569 32 22.7981 31.0162 22.6494 30.0037C22.6363 29.9175 22.6206 29.8325 22.6019 29.75L20.5625 18.8294L20.2006 16.0169C19.9387 14.3788 20.1494 13.8375 20.2206 13.7106C20.2225 13.7076 20.2242 13.7045 20.2256 13.7013C20.2931 13.5763 20.6006 13.2963 21.3181 13.0269L26.8981 11.0763C26.9324 11.0671 26.9662 11.0563 26.9994 11.0438C27.9994 10.6688 28.9994 10.15 28.9994 9.04813C28.9994 7.94625 28.1875 6.73813 27 7.05Z' fill='white'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_1_1506'%3E%3Crect width='32' height='32' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E%0A' style='visibility: visible !important;'>
	<span>Accessibility Options</span>";
    }

    /**
     * Extracted HTML template for widget markup.
     * Tip: Move large HTML markup blocks into Blade views (e.g., view('widgets.accessibility')->render())
     */
    private function getWidgetSectionHtml(): string
    {
        return "<audio id='googleTextSpeecher'></audio><div class='nac light-theme gradient-head accessability-initial custom_widget' id='main_w_container' ><div id='widget_header'><div class='relative second-panel'><div class='accessability-reset accessability-f_item widget_header' title='Reset accessability features.' id='reset-all' onclick='resetAll()'><svg xmlns='http://www.w3.org/2000/svg' width='30' height='30' fill='currentColor' class='bi bi-bootstrap-reboot' viewBox='0 0 16 16' style='color:#fff'><path d='M1.161 8a6.84 6.84 0 1 0 6.842-6.84.58.58 0 1 1 0-1.16 8 8 0 1 1-6.556 3.412l-.663-.577a.58.58 0 0 1 .227-.997l2.52-.69a.58.58 0 0 1 .728.633l-.332 2.592a.58.58 0 0 1-.956.364l-.643-.56A6.8 6.8 0 0 0 1.16 8z'/><path d='M6.641 11.671V8.843h1.57l1.498 2.828h1.314L9.377 8.665c.897-.3 1.427-1.106 1.427-2.1 0-1.37-.943-2.246-2.456-2.246H5.5v7.352zm0-3.75V5.277h1.57c.881 0 1.416.499 1.416 1.32 0 .84-.504 1.324-1.386 1.324z'/></svg></div><h3>Accessibility</h3><div class='accessability-close accessability-f_item' title='Close accessability features.' onclick='closeMain()'></div></div></div><div class='accessability-body' id='widget_body'><div class='h-scroll'><div class='row p-0 m-0 slider_main_section'></div><div class='gvc_ffeature'><div class='accessability-f_item reset-feature' id='featureItem-zoom' title='Increase or Decrease Zoom Level.'><button id='' class='accessability-f_item__i' data-reader-content='Enable the UserWay screen reader' aria-label='Enable the UserWay screen reader' aria-pressed='false'><span class='accessability-f_item__icon'><span class='waf-icon icon-zoom-control'> </span></span><div class='accessability-f_item__name inline_ranger_container'><div class='slider-container'><label for='zoom_ranger' class='slider-label left'>Small</label><label for='zoom_ranger' class='slider-label middle'>Normal</label><label for='zoom_ranger' class='slider-label right'>Large</label><input type='range' class='custom-range' id='zoom_ranger' min='-4' max='4' step='1' value='0'></div></div><span class='tick-active accessability-f_item__enabled reset-tick' id='tickIcon-zoom' style='top:-5px;right:0;display: none;'> </span></button></div><div class='accessability-f_item reset-feature' id='featureItem-font_size' title='Increase or Decrease Font size.'><button id='' class='accessability-f_item__i' data-reader-content='Enable the UserWay screen reader' aria-label='Enable the UserWay screen reader' aria-pressed='false'><span class='accessability-f_item__icon'><span class='waf-icon icon-small-text'> </span></span><div class='accessability-f_item__name inline_ranger_container'><div class='slider-container'><label for='font_size_ranger' class='slider-label left'>Small</label><label for='font_size_ranger' class='slider-label middle'>Normal</label><label for='font_size_ranger' class='slider-label right'>Large</label><input type='range' class='custom-range' id='font_size_ranger' min='-4' max='4' step='1' value='0'></div></div><span class='tick-active accessability-f_item__enabled reset-tick' id='tickIcon-font_size' style='top:-5px;right:0;display: none;'> </span></button></div><div class='accessability-f_item reset-feature' id='featureItem-line_height' title='Increase or Decrease line height.'><button id='' class='accessability-f_item__i' data-reader-content='Enable the UserWay screen reader' aria-label='Enable the UserWay screen reader' aria-pressed='false'><span class='accessability-f_item__icon'><span class='waf-icon icon-line-hight'> </span></span><div class='accessability-f_item__name inline_ranger_container'><div class='slider-container'><label for='line_height_ranger' class='slider-label left'>Normal</label><label for='line_height_ranger' class='slider-label middle'>Medium</label><label for='line_height_ranger' class='slider-label right'>Larger</label><input type='range' class='custom-range' id='line_height_ranger' min='0' max='4' step='1' value='0'></div></div><span class='tick-active accessability-f_item__enabled reset-tick' id='tickIcon-line_height' style='top:-5px;right:0;display: none;'> </span></button></div><div class='accessability-f_item reset-feature' id='featureItem-text_space' title='Increase or Decrease text space.'><button id='' class='accessability-f_item__i' data-reader-content='Enable the UserWay screen reader' aria-label='Enable the UserWay screen reader' aria-pressed='false'><span class='accessability-f_item__icon'><span class='waf-icon icon-text-spacing'> </span></span><div class='accessability-f_item__name inline_ranger_container'><div class='slider-container'><label for='text_space_ranger' class='slider-label left'>Normal</label><label for='text_space_ranger' class='slider-label middle'>Medium</label><label for='text_space_ranger' class='slider-label right'>Larger</label><input type='range' class='custom-range' id='text_space_ranger' min='0' max='4' step='1' value='0'></div></div><span class='tick-active accessability-f_item__enabled reset-tick' id='tickIcon-text_space' style='top:-5px;right:0;display: none;'> </span></button></div><div class='accessability-f_item reset-feature d-none' id='featureItem-lh' title='Increase of Decrease line height.'><button id='btn-s12' class='accessability-f_item__i' data-reader-content='Enable the UserWay screen reader' aria-label='Enable the UserWay screen reader' aria-pressed='false'><span class='accessability-f_item__icon'><span class='waf-icon icon-line-hight'> </span></span><span class='accessability-f_item__name'>Line Height</span><div class='accessability-f_item__steps reset-steps' id='featureSteps-lh'><!-- Steps span tags will be dynamically added here --></div> <span class='tick-active accessability-f_item__enabled reset-tick' id='tickIcon-lh' style='display: none'> </span></button></div><div class='accessability-f_item reset-feature d-none' id='featureItem-ts' title='Increase or Decrease text spacing.'><button id='btn-s13' onclick='increaseAndReset()' class='accessability-f_item__i' data-reader-content='Enable the UserWay screen reader' aria-label='Enable the UserWay screen reader' aria-pressed='false'><span class='accessability-f_item__icon'><span class='waf-icon icon-text-spacing'> </span></span> <span class='accessability-f_item__name'>Text Spacing</span><div class='accessability-f_item__steps reset-steps' id='featureSteps-ts'><!-- Steps span tags will be dynamically added here --></div> <span class='tick-active accessability-f_item__enabled reset-tick' id='tickIcon-ts' style='display: none'> </span></button></div><!-- Scroll up down --><div class='row'><div class='col' id='slideUpDown'><div class='accessability-f_item reset-feature'><button id='scrollUpBtn' class='accessability-f_item__i speakIt' style='margin-right: 5px;' title='Scroll Up' aria-pressed='false'><span class='accessability-f_item__icon'><span class='waf-icon icon-scrollUp'> </span> <span class='accessability-f_item__name'>Scroll Up</span></span><span class='tick-active accessability-f_item__enabled reset-tick' id='scrollUptickIcon' style='display: none;'> </span></button></div></div><div class='col'><div class='accessability-f_item reset-feature'><button id='scrollDownBtn' class='accessability-f_item__i speakIt' title='Scroll Down' aria-pressed='false'><span class='accessability-f_item__icon'><span class='waf-icon icon-scrollDown'> </span><span class='accessability-f_item__name'>Scroll Down</span></span><span class='tick-active accessability-f_item__enabled reset-tick' id='scrollDowntickIcon' style='display: none;'> </span></button></div></div></div><!-- Scroll up down / --><div class='row'><div class='col accessability-f_item reset-feature' id='featureItem-ht-dark' title='Enable or Disable, light or Dark Mode.'><button id='dark-btn' title='Enable or Disable, light or Dark Mode.' class='accessability-f_item__i speakIt' aria-pressed='false'><span class='accessability-f_item__name'><span class='light_dark_icon'><input type='checkbox' class='light_mode accessability-featugres__item__i' id='checkbox'> <label for='checkbox' class='checkbox-label'><svg class='svg-icon' style='width: 1em; height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;' viewBox='0 0 1024 1024' version='1.1' xmlns='http://www.w3.org/2000/svg'><path d='M320 85.333333C243.626667 134.4 192 221.013333 192 320 192 418.986667 243.626667 505.6 321.28 554.666667 190.293333 554.666667 85.333333 449.706667 85.333333 320 85.333333 190.293333 190.293333 85.333333 320 85.333333M813.653333 149.333333 874.666667 210.346667 210.346667 874.666667 149.333333 813.653333 813.653333 149.333333M549.973333 253.013333 486.826667 213.333333 425.386667 256 443.306667 183.466667 384 138.24 458.666667 133.12 483.413333 62.72 512 132.266667 585.813333 133.546667 528.213333 181.76 549.973333 253.013333M409.173333 407.04 359.68 375.893333 311.893333 409.173333 326.4 352.853333 279.893333 317.44 337.92 313.6 357.12 258.56 378.88 312.746667 436.906667 314.026667 392.106667 351.146667 409.173333 407.04M810.666667 576C810.666667 705.706667 705.706667 810.666667 576 810.666667 523.946667 810.666667 475.733333 793.6 436.906667 765.013333L765.013333 436.906667C793.6 475.733333 810.666667 523.946667 810.666667 576M622.933333 856.746667 741.12 807.68 730.88 950.613333 622.933333 856.746667M807.68 741.546667 856.746667 623.36 950.613333 731.733333 807.68 741.546667M856.746667 529.92 808.106667 411.306667 950.613333 421.546667 856.746667 529.92M410.88 807.68 529.066667 856.746667 421.12 950.186667 410.88 807.68Z' /></svg></label></span> <span class='accessability-f_item__name'>Light-Dark</span></span><span class='tick-active accessability-f_item__enabled reset-tick' id='tickIcon-ht-dark' style='display: none; pointer-events: none;'> </span></button></div><!-- Invert Colors Widget --><div class='col accessability-f_item reset-feature' id='featureItem-ic' title='Invert color'><button id='btn-invert' class='accessability-f_item__i speakIt' title='Invert color' aria-pressed='false'><span class='accessability-f_item__icon'> <span class='waf-icon icon-invert'> </span> </span><span class='accessability-f_item__name'>Invert Colors</span> <span class='tick-active accessability-f_item__enabled reset-tick' id='tickIcon-ic' style='display: none'> </span></button></div></div><div class='row'><div class='col'><div class='accessability-f_item reset-feature' id='featureItem-hi' title='Hide or Unhide images.'><button id='btn-s11' onclick='toggleImages()' class='accessability-f_item__i' data-reader-content='Enable the UserWay screen reader' aria-label='Enable the UserWay screen reader' aria-pressed='false'><span class='accessability-f_item__icon'><span class='waf-icon icon-hide-images'> </span></span><span class='accessability-f_item__name'>Hide Images</span> <span class='tick-active accessability-f_item__enabled reset-tick' id='tickIcon-hi' style='display: none;'> </span></button></div></div><div class='col'><div class='accessability-f_item reset-feature' id='featureItem-Cursor' title='Show or Hide cursor.'><button id='btn-cursor' onclick='toggleCursorFeature()' class='accessability-f_item__i' data-reader-content='Enable the UserWay screen reader' aria-label='Enable the UserWay screen reader' aria-pressed='false'><span class='accessability-f_item__icon'> <span class='waf-icon icon-cursor'> </span> </span><span class='accessability-f_item__name'>Cursor</span> <span class='tick-active accessability-f_item__enabled reset-tick' id='tickIcon-cursor' style='display: none;'> </span></button></div></div></div><div class='accessability-f_item reset-feature' id='featureItem_sp' title='Enable or Disable Screen reader.'><button id='speak' class='accessability-f_item__i' data-reader-content='Enable the UserWay screen reader' aria-label='Enable the UserWay screen reader' aria-pressed='false'><span class='accessability-f_item__icon'> <span class='waf-icon icon-speaker'> </span> </span><span class='accessability-f_item__name'>Screen Reader</span> <span class='tick-active accessability-f_item__enabled reset-tick' id='tickIcon_sp' style='display: none;'> </span></button></div><div class='accessability-f_item reset-feature' id='featureItem-ht' title='Highlight Link.'><button id='btn-s10' onclick='highlightLinks()' class='accessability-f_item__i' data-reader-content='Enable the UserWay screen reader' aria-label='Enable the UserWay screen reader' aria-pressed='false'><span class='accessability-f_item__icon'><span class='waf-icon icon-highlight-links'> </span></span> <span class='accessability-f_item__name'>Highlight Links</span> <span class='tick-active accessability-f_item__enabled reset-tick' id='tickIcon-ht' style='display: none'> </span></button></div><div class='accessability-f_item reset-feature d-none' id='featureItem'><button id='btn-s9' class='accessability-f_item__i' data-reader-content='Enable the UserWay screen reader' aria-label='Enable the UserWay screen reader' aria-pressed='false'><span class='accessability-f_item__icon'><span class='waf-icon icon-bigger-text'> </span></span><span class='accessability-f_item__name'>Bigger Text</span><div class='accessability-f_item__steps reset-steps' id='featureSteps'><!-- Steps span tags will be dynamically added here --></div> <span class='tick-active accessability-f_item__enabled reset-tick' id='tickIcon' style='display: none'> </span></button></div><div class='accessability-f_item reset-feature d-none' id='featureItem-st'><button id='btn-small-text' class='accessability-f_item__i' data-reader-content='Enable the UserWay screen reader' aria-label='Enable the UserWay screen reader' aria-pressed='false'><span class='accessability-f_item__icon'><span class='waf-icon icon-small-text'> </span></span><span class='accessability-f_item__name'>Small Text</span><div class='accessability-f_item__steps reset-steps' id='featureSteps-st'><!-- Steps span tags will be dynamically added here --></div> <span class='tick-active accessability-f_item__enabled reset-tick' id='tickIcon-st' style='display: none'> </span></button></div><div class='accessability-f_item reset-feature' id='featureItem-df' title='Dyslexia Friendly feature.'><button id='btn-df' onclick='toggleFontFeature()' class='accessability-f_item__i' data-reader-content='Enable the UserWay screen reader' aria-label='Enable the UserWay screen reader' aria-pressed='false'><span class='accessability-f_item__icon'><span class='waf-icon icon-dyslexia-font'> </span></span> <span class='accessability-f_item__name'>Dyslexia Friendly</span> <span class='tick-active accessability-f_item__enabled reset-tick' id='tickIcon-df' style='display: none;'> </span></button></div></div></div> <!-- Reset Button --></div></div>";
    }
}