from flask import Flask, request, jsonify
from flask_cors import CORS

from werkzeug.utils import secure_filename

import os
import uuid


# ==========================================
# FLASK APP
# ==========================================

app = Flask(__name__)

CORS(app)


# ==========================================
# CONFIG
# ==========================================

BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)

UPLOAD_FOLDER = os.path.join(
    BASE_DIR,
    "uploads"
)


os.makedirs(
    UPLOAD_FOLDER,
    exist_ok=True
)


app.config[
    "UPLOAD_FOLDER"
] = UPLOAD_FOLDER


# Maximum image size = 10 MB

app.config[
    "MAX_CONTENT_LENGTH"
] = 10 * 1024 * 1024


ALLOWED_EXTENSIONS = {
    "jpg",
    "jpeg",
    "png",
    "webp"
}


# ==========================================
# FILE VALIDATION
# ==========================================

def allowed_file(filename):

    if "." not in filename:
        return False


    extension = filename.rsplit(
        ".",
        1
    )[1].lower()


    return extension in ALLOWED_EXTENSIONS


# ==========================================
# HOME API
# ==========================================

@app.route("/", methods=["GET"])
def home():

    return jsonify({

        "success": True,

        "message":
            "🌱 CropCare AI Backend is running",

        "status":
            "online"

    })


# ==========================================
# HEALTH API
# ==========================================

@app.route(
    "/api/health",
    methods=["GET"]
)
def health():

    return jsonify({

        "success": True,

        "backend":
            "online"

    })


# ==========================================
# CROP ANALYSIS API
# ==========================================

@app.route(
    "/api/analyze",
    methods=["POST"]
)
def analyze_crop():

    try:

        # ==================================
        # GET IMAGE
        # ==================================

        image = request.files.get(
            "image"
        )


        if image is None:

            return jsonify({

                "success": False,

                "error":
                    "Please upload a crop image."

            }), 400


        if image.filename == "":

            return jsonify({

                "success": False,

                "error":
                    "No image selected."

            }), 400


        # ==================================
        # FILE TYPE
        # ==================================

        if not allowed_file(
            image.filename
        ):

            return jsonify({

                "success": False,

                "error":
                    "Only JPG, JPEG, PNG and WEBP images are allowed."

            }), 400


        # ==================================
        # FORM DATA
        # ==================================

        crop = request.form.get(
            "crop",
            ""
        ).strip()


        stage = request.form.get(
            "stage",
            ""
        ).strip()


        location = request.form.get(
            "location",
            ""
        ).strip()


        question = request.form.get(
            "question",
            ""
        ).strip()


        # ==================================
        # VALIDATION
        # ==================================

        if not crop:

            return jsonify({

                "success": False,

                "error":
                    "Crop name is required."

            }), 400


        if not stage:

            return jsonify({

                "success": False,

                "error":
                    "Growth stage is required."

            }), 400


        if not location:

            return jsonify({

                "success": False,

                "error":
                    "Location is required."

            }), 400


        if not question:

            return jsonify({

                "success": False,

                "error":
                    "Please describe the crop problem."

            }), 400


        # ==================================
        # SAFE FILE NAME
        # ==================================

        original_name = secure_filename(
            image.filename
        )


        extension = original_name.rsplit(
            ".",
            1
        )[1].lower()


        unique_filename = (
            uuid.uuid4().hex
            + "."
            + extension
        )


        image_path = os.path.join(
            UPLOAD_FOLDER,
            unique_filename
        )


        # ==================================
        # SAVE IMAGE
        # ==================================

        image.save(
            image_path
        )


        # ==================================
        # IMAGE VALIDATION
        # ==================================

        try:

            from PIL import Image

            with Image.open(
                image_path
            ) as img:

                img.verify()

        except Exception:

            if os.path.exists(
                image_path
            ):

                os.remove(
                    image_path
                )


            return jsonify({

                "success": False,

                "error":
                    "Uploaded file is not a valid image."

            }), 400


        # ==================================
        # AI MODEL
        # ==================================

        model_path = os.path.join(
            BASE_DIR,
            "models",
            "crop_disease_model.keras"
        )


        # ----------------------------------
        # MODEL NOT AVAILABLE
        # ----------------------------------

        if not os.path.exists(
            model_path
        ):

            return jsonify({

                "success": False,

                "model_status":
                    "not_installed",

                "message":
                    "Backend is working, but the AI model is not installed yet. Add crop_disease_model.keras inside backend/models/."

            }), 200


        # ==================================
        # REAL MODEL INTEGRATION
        # ==================================
        #
        # Your trained TensorFlow/Keras
        # model should be loaded here.
        #
        # Example:
        #
        # model.predict(...)
        #
        # ==================================


        return jsonify({

            "success": False,

            "model_status":
                "not_configured",

            "message":
                "AI model file exists, but model inference has not been configured yet."

        }), 200


    except Exception as error:

        print(
            "ANALYZE ERROR:",
            error
        )


        return jsonify({

            "success": False,

            "error":
                "Server error while analyzing the crop."

        }), 500


# ==========================================
# CHAT API
# ==========================================

@app.route(
    "/api/chat",
    methods=["POST"]
)
def chat():

    try:

        data = request.get_json(
            silent=True
        )


        if not data:

            return jsonify({

                "success": False,

                "error":
                    "Invalid JSON request."

            }), 400


        message = str(
            data.get(
                "message",
                ""
            )
        ).strip()


        if not message:

            return jsonify({

                "success": False,

                "error":
                    "Message is required."

            }), 400


        text = message.lower()


        # ==================================
        # CHAT RESPONSES
        # ==================================

        if any(
            word in text
            for word in [
                "hello",
                "hi",
                "hey"
            ]
        ):

            reply = (
                "👋 Hello! I'm CropCare AI Assistant. "
                "Tell me your crop name and describe the symptoms."
            )


        elif (
            "yellow" in text
            or "yellowing" in text
        ):

            reply = (
                "🌿 Yellow leaves can have several causes, "
                "including nutrient imbalance, water stress, "
                "root problems or disease. Check soil moisture "
                "and upload a clear image for further assessment."
            )


        elif (
            "water" in text
            or "irrigation" in text
        ):

            reply = (
                "💧 Irrigation depends on crop type, soil, "
                "weather and growth stage. Avoid prolonged "
                "waterlogging and severe drying."
            )


        elif (
            "pest" in text
            or "insect" in text
            or "bug" in text
        ):

            reply = (
                "🐛 Check both sides of leaves for insects, "
                "eggs, webbing or feeding damage. A clear "
                "close-up image can help with preliminary assessment."
            )


        elif (
            "fertilizer" in text
            or "fertiliser" in text
        ):

            reply = (
                "🌱 Fertilizer requirements depend on crop "
                "and soil conditions. A soil test and crop-specific "
                "recommendation are preferable before application."
            )


        elif "rice" in text:

            reply = (
                "🌾 For rice, monitor leaf spots, discoloration, "
                "water management and insect activity. Crop stage "
                "and recent rainfall are also useful information."
            )


        elif "tomato" in text:

            reply = (
                "🍅 For tomato, inspect leaves, stems and fruit "
                "separately. Look for spots, curling, wilting, "
                "insects and unusual discoloration."
            )


        elif (
            "disease" in text
            or "fungus" in text
            or "infection" in text
        ):

            reply = (
                "🔎 Several crop diseases can produce similar "
                "symptoms. Crop name, growth stage, clear images "
                "and recent weather information can help narrow "
                "down the possibilities."
            )


        elif (
            "thank" in text
            or "thanks" in text
        ):

            reply = (
                "😊 You're welcome! Feel free to ask another "
                "crop-related question."
            )


        else:

            reply = (
                "🤖 Please tell me the crop name and describe "
                "the symptoms. You can also upload a clear crop "
                "image in the Diagnosis section."
            )


        return jsonify({

            "success": True,

            "reply": reply

        })


    except Exception as error:

        print(
            "CHAT ERROR:",
            error
        )


        return jsonify({

            "success": False,

            "error":
                "Chat service error."

        }), 500


# ==========================================
# FILE TOO LARGE
# ==========================================

@app.errorhandler(413)
def file_too_large(error):

    return jsonify({

        "success": False,

        "error":
            "Image size must be less than 10MB."

    }), 413


# ==========================================
# RUN SERVER
# ==========================================

if __name__ == "__main__":

    print("")
    print("======================================")
    print("🌱 CropCare AI Backend")
    print("======================================")
    print(
        "Server: http://127.0.0.1:5000"
    )
    print("======================================")
    print("")


    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route("/")
def home():
    return jsonify({
        "status": "success",
        "message": "CropCare AI Backend is running!"
    })


@app.route("/health")
def health():
    return jsonify({
        "status": "healthy"
    })


if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)
