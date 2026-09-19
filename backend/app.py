from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

# =========================
# CONFIG
# =========================

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER


# =========================
# HOME / BACKEND CHECK
# =========================

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "success": True,
        "message": "CropCare AI Backend is Running",
        "status": "online"
    })


# =========================
# HEALTH CHECK
# =========================

@app.route("/api/health", methods=["GET"])
def health():

    return jsonify({
        "success": True,
        "status": "ok",
        "message": "Backend connected successfully"
    })


# =========================
# CROP ANALYSIS
# =========================

@app.route("/api/analyze", methods=["POST"])
def analyze_crop():

    try:

        crop = request.form.get("crop", "").strip()
        stage = request.form.get("stage", "").strip()
        location = request.form.get("location", "").strip()
        question = request.form.get("question", "").strip()

        image = request.files.get("image")

        # -------------------------
        # VALIDATION
        # -------------------------

        if not crop:
            return jsonify({
                "success": False,
                "error": "Crop name is required."
            }), 400

        if not stage:
            return jsonify({
                "success": False,
                "error": "Growth stage is required."
            }), 400

        if not location:
            return jsonify({
                "success": False,
                "error": "Location is required."
            }), 400

        if not question:
            return jsonify({
                "success": False,
                "error": "Crop problem is required."
            }), 400

        if not image:
            return jsonify({
                "success": False,
                "error": "Crop image is required."
            }), 400

        # -------------------------
        # SAVE IMAGE
        # -------------------------

        filename = secure_filename(image.filename)

        if not filename:
            return jsonify({
                "success": False,
                "error": "Invalid image filename."
            }), 400

        image_path = os.path.join(
            app.config["UPLOAD_FOLDER"],
            filename
        )

        image.save(image_path)

        # -------------------------
        # DEMO ANALYSIS
        # -------------------------

        disease = "Possible Crop Health Issue"
        confidence = 75
        status = "Moderate"

        evidence = [
            f"Crop: {crop}",
            f"Growth stage: {stage}",
            f"Location: {location}",
            "Farmer symptoms were received.",
            "Crop image received successfully."
        ]

        actions = [
            "Monitor the affected crop regularly.",
            "Check the underside of leaves for pests or disease symptoms.",
            "Check irrigation and soil moisture conditions.",
            "Check whether the crop is receiving suitable nutrients.",
            "Upload a clearer close-up image if symptoms are unclear.",
            "Consult an agricultural expert before chemical treatment."
        ]

        # -------------------------
        # RESPONSE
        # -------------------------

        return jsonify({

            "success": True,

            "result": {

                "crop": crop,

                "stage": stage,

                "location": location,

                "question": question,

                "disease": disease,

                "confidence": confidence,

                "status": status,

                "evidence": evidence,

                "actions": actions

            }

        }), 200

    except Exception as e:

        print("ANALYZE ERROR:", e)

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


# =========================
# CHAT API
# =========================

@app.route("/api/chat", methods=["POST"])
def chat():

    try:

        data = request.get_json(silent=True) or {}

        message = data.get(
            "message",
            ""
        ).strip().lower()

        if not message:

            return jsonify({
                "success": False,
                "error": "Message is required."
            }), 400

        # -------------------------
        # SIMPLE CHAT RESPONSES
        # -------------------------

        if "yellow" in message:

            reply = (
                "Yellow leaves can have several causes such as "
                "nutrient problems, water stress or disease. "
                "Upload a clear crop image for better assessment."
            )

        elif (
            "water" in message
            or "irrigation" in message
        ):

            reply = (
                "Irrigation depends on crop, soil, weather and "
                "growth stage. Avoid prolonged waterlogging and "
                "severe drying."
            )

        elif (
            "pest" in message
            or "insect" in message
        ):

            reply = (
                "Check both sides of the leaves for insects, "
                "eggs, webbing or feeding damage."
            )

        elif "disease" in message:

            reply = (
                "Several plant diseases can produce similar "
                "symptoms. Crop name, growth stage and a clear "
                "image can help narrow the possibilities."
            )

        else:

            reply = (
                "I can help with crop diseases, pests, irrigation, "
                "fertilizer and crop health. Tell me your crop name "
                "and describe the symptoms."
            )

        return jsonify({

            "success": True,

            "reply": reply

        }), 200

    except Exception as e:

        print("CHAT ERROR:", e)

        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


# =========================
# RUN SERVER
# =========================

if __name__ == "__main__":

    print("\n====================================")
    print("🌱 CropCare AI Backend")
    print("====================================")
    print("Backend: http://127.0.0.1:5000")
    print("Health : http://127.0.0.1:5000/api/health")
    print("Analyze: POST /api/analyze")
    print("Chat   : POST /api/chat")
    print("====================================\n")

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )
