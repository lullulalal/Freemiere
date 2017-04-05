package com.sc32c3.freemiere.controller;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;

import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.sc32c3.freemiere.dao.FileFolderDAO;
import com.sc32c3.freemiere.util.FileManager;
import com.sc32c3.freemiere.vo.FileFolder;

@Controller
public class FileFolderController {

	private static final Logger logger = LoggerFactory.getLogger(FileFolderController.class);

	@Autowired
	FileFolderDAO fileFolderDAO;

	// @RequestMapping(value = "storage", method = RequestMethod.GET)
	// public String storage() {
	// System.out.println("??");
	// return "storage";
	// }

	@ResponseBody
	@RequestMapping(value = "loadTrash", method = RequestMethod.GET, produces = "application/json;charset=utf-8")
	public ArrayList<FileFolder> loadTrash(HttpSession session) {
		logger.info("서버:loadTrash 실행 ");

		String email = (String) session.getAttribute("loginMem");
		ArrayList<FileFolder> rtn = fileFolderDAO.getTrashList(email);

		for (FileFolder ff : rtn) {
			File f = new File(ff.getPath());
			ff.setIsFolder(f.isDirectory());
			ff.setFileName(f.getName());
		}

		return rtn;
	}

	@ResponseBody
	@RequestMapping(value = "loadShared", method = RequestMethod.GET, produces = "application/json;charset=utf-8")
	public ArrayList<FileFolder> loadShared(HttpSession session) {
		logger.info("서버:loadShared 실행 ");

		String email = (String) session.getAttribute("loginMem");
		ArrayList<FileFolder> rtn = fileFolderDAO.getSharedList(email);

		for (FileFolder ff : rtn) {
			File f = new File(ff.getPath());
			ff.setIsFolder(f.isDirectory());
			ff.setFileName(f.getName());
		}

		return rtn;
	}

	@ResponseBody
	@RequestMapping(value = "loadBookmark", method = RequestMethod.GET, produces = "application/json;charset=utf-8")
	public ArrayList<FileFolder> loadBookmark(HttpSession session) {

		logger.info("서버:loadBookmark 실행 ");

		String email = (String) session.getAttribute("loginMem");
		ArrayList<FileFolder> myStorageList = fileFolderDAO.getMyStorageBookmarkList(email);
		ArrayList<FileFolder> sharedList = fileFolderDAO.getSharedBookmarkList(email);
		myStorageList.addAll(sharedList);

		for (FileFolder ff : myStorageList) {
			File f = new File(ff.getPath());
			ff.setIsFolder(f.isDirectory());
			ff.setFileName(f.getName());
		}

		return myStorageList;
	}

	@ResponseBody
	@RequestMapping(value = "loadMyStorage", method = RequestMethod.GET, produces = "application/json;charset=utf-8")
	public ArrayList<FileFolder> loadMyStorage(HttpSession session) {

		logger.info("서버:loadMyStorage 실행 ");

		String email = (String) session.getAttribute("loginMem");

		// ArrayList<FileFolder> myStorageList =
		// fileFolderDAO.getMyStorageList(email);

		ArrayList<FileFolder> myStorageList = loadList("c:\\freemiere\\" + email, session);
		ArrayList<FileFolder> sharedList = fileFolderDAO.getSharedList(email);

		for (FileFolder ff : sharedList) {
			File f = new File(ff.getPath());
			ff.setIsFolder(f.isDirectory());
			ff.setFileName(f.getName());

		}

		myStorageList.addAll(sharedList);

		return myStorageList;
	}

	@ResponseBody
	@RequestMapping(value = "loadRecent", method = RequestMethod.GET, produces = "application/json;charset=utf-8")
	public ArrayList<FileFolder> loadRecent(String path, HttpSession session) {
		logger.info("서버:recentList 실행 " + path);
		String email = (String) session.getAttribute("loginMem");
		
		 //SimpleDateFormat sf = new SimpleDateFormat("yyyy-MM-dd / HH:mm:ss");//파일 수정 날짜 확인
		 //System.out.println(sf.format(f.lastModified()));
		 
		HashMap<Integer, FileFolder> all = new HashMap<>();
		//ArrayList<FileFolder> all = new ArrayList<>();// 파일 하나하나가 담길 리스트

		ArrayList<File> myStorageList = new ArrayList<>();// 사용자 컴퓨터의 파일을 담을 리스트
		
		FileManager.findFileRecursive("c:\\freemiere\\" + email, myStorageList);

		ArrayList<FileFolder> sharedList = fileFolderDAO.getSharedList(email);
		// 아래 for문 안에서 findfilerecursive 함수를 호출 하여 모든 파일을 읽어 mystoragelist에
		// add한다.
		for (FileFolder ff : sharedList) {
			FileManager.findFileRecursive(ff.getPath(), myStorageList);// findfilerecursive함수
																		// 호출
		}
		SimpleDateFormat dateFormat = new SimpleDateFormat("YYYY/MM/DD");
	
		// vo에 수정날짜 추가. updatedate 추가함
		for (File f : myStorageList) {
			String p = f.getAbsolutePath();
			if (f.isDirectory() == true)
				p += "\\";
			
			/*dateFormat을 거치면서 날짜 형태가 이상하게 바뀜*/
			Date updatedate = new Date(f.lastModified());
			//System.out.println(updatedate);
			System.out.println(dateFormat.format(updatedate));
			System.out.println(p + ", " + f.lastModified());

			FileFolder ff = fileFolderDAO.getFilerFolerInfo(p, email);
			if (ff == null)
				continue;
			ff.setIsFolder(f.isDirectory());
			ff.setFileName(f.getName());
			ff.setStrUpdate(dateFormat.format(updatedate));
			ff.setLnUpdate(f.lastModified());
			all.put(ff.getFfid(), ff);
		}

		ArrayList<FileFolder> rtn = new ArrayList<FileFolder>(all.values());
		Collections.sort(rtn);
		//Collections.reverse(rtn);
		
		return rtn;
		
		// myStorageList for문 돌면서 각각 파일의 정보를 db에서 가져온다
		// db에서 가져 오면서 FileFolder 객체를 만들어(필드 셋팅) all 에 넣어준다.
		// ArrayList<FileFolder> all 을 FileFolder의 필드인 수정 날짜로 정렬 하는 함수를 만든다.
		// 위 함수로 all을 정렬

		/*
		 * 레코드의 변경시간 조회 SELECT ora_rowscn , scn_to_timestamp(ora_rowscn) FROM
		 * 테이블;
		 */

	}

	@ResponseBody
	@RequestMapping(value = "loadList", method = RequestMethod.GET, produces = "application/json;charset=utf-8")
	public ArrayList<FileFolder> loadList(String path, HttpSession session) {

		logger.info("서버:loadList 실행 " + path);

		String email = (String) session.getAttribute("loginMem");

		String loadPath = path;
		if (path.charAt(path.length() - 1) != '\\')
			loadPath += "\\";
		System.out.println(loadPath);
		File[] files = FileManager.findFile(loadPath);
		ArrayList<FileFolder> rtn = new ArrayList<>();

		FileManager.fileSort(files);

		for (File f : files) {
			String p = f.getAbsolutePath();
			if (f.isDirectory() == true)
				p += "\\";
			System.out.println(p);
			FileFolder ff = fileFolderDAO.getFilerFolerInfo(p, email);
			if (ff == null)
				continue;
			ff.setIsFolder(f.isDirectory());
			ff.setFileName(f.getName());
			rtn.add(ff);

			/*
			 * SimpleDateFormat sf = new
			 * SimpleDateFormat("yyyy-MM-dd / HH:mm:ss");//파일 수정 날짜 확인
			 * System.out.println(sf.format(f.lastModified()));
			 */
		}

		return rtn;
	}
	/*@ResponseBody
	@RequestMapping(value = "loadSearch", method = RequestMethod.GET, produces = "application/json;charset=utf-8")
	public ArrayList<FileFolder> loadSrarch(String title, HttpSession session) {
	//검색기능
		logger.info("서버:loadSearch 실행 ");

		String email = (String) session.getAttribute("loginMem");
		ArrayList<FileFolder> searchall = new ArrayList<>();

		ArrayList<FileFolder> myStorageList = loadList("c:\\freemiere\\" + email, session);
		ArrayList<FileFolder> sharedList = fileFolderDAO.getSearchList(email);

		for (FileFolder ff : sharedList) {
			if(title.equals(ff.getPath())){
				
			File f = new File(ff.getPath());
			ff.setIsFolder(f.isDirectory());
			ff.setFileName(f.getName());
			searchall.add(ff);
			}
			else {
				System.out.println("검색결과 없음");
			}
		}
		return searchall;
	}*/
	
	/*
	 * @ResponseBody//동영상 편집 화면이동
	 * 
	 * @RequestMapping(value = "loadEdit", method = RequestMethod.GET , produces
	 * = "application/json;charset=utf-8") public ArrayList<FileFolder>
	 * loadEdit(HttpSession session){ logger.info("서버:loadEdit 실행 ");
	 * 
	 * String email= (String)session.getAttribute("loginMem");
	 * 
	 * return editForm; }
	 */
}
