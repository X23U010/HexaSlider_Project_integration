package Servlet;

import java.io.IOException;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/Execute_Servlet")
public class Execute_Servlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		// リクエストパラメータを取得
		String action = request.getParameter("action");
		String targetJsp = "WEB-INF/jsp/index.jsp"; // デフォルトはマイページ等があるメイン画面

		// actionの値によってフォワード先を切り替え
		if ("shop".equals(action)) {
			targetJsp = "WEB-INF/jsp/monodata_shop.jsp";
		}

		RequestDispatcher dispatcher = request.getRequestDispatcher(targetJsp);
		dispatcher.forward(request, response);
		
	}

}