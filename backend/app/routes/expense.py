from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.expense import Expense
from datetime import datetime

expense_bp = Blueprint("expense", __name__, url_prefix="/expenses")


@expense_bp.route("/", methods=["POST"])
@jwt_required()
def add_expense():
    user_id = int(get_jwt_identity())   # ✅ FIX HERE
    data = request.get_json()

    expense = Expense(
        title=data["title"],
        amount=float(data["amount"]),
        date=datetime.fromisoformat(data["date"]),
        user_id=user_id
    )

    db.session.add(expense)
    db.session.commit()

    return {"message": "Expense added"}, 201


@expense_bp.route("/", methods=["GET"])
@jwt_required()
def get_expenses():
    user_id = int(get_jwt_identity())   # ✅ FIX HERE
    expenses = Expense.query.filter_by(user_id=user_id).all()

    return jsonify([
        {
            "id": e.id,
            "title": e.title,
            "amount": e.amount,
            "date": e.date.strftime("%Y-%m-%d")
        }
        for e in expenses
    ])


@expense_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_expense(id):
    user_id = int(get_jwt_identity())   # ✅ FIX HERE
    expense = Expense.query.filter_by(id=id, user_id=user_id).first_or_404()

    db.session.delete(expense)
    db.session.commit()

    return {"message": "Deleted"}


@expense_bp.route("/summary", methods=["GET"])
@jwt_required()
def monthly_summary():
    user_id = int(get_jwt_identity())   # ✅ FIX HERE
    expenses = Expense.query.filter_by(user_id=user_id).all()

    total = sum(e.amount for e in expenses)

    return {"total_spent": total}
