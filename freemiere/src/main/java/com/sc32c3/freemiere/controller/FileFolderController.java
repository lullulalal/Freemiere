package com.sc32c3.freemiere.controller;

import java.io.File;
import java.rmi.server.SocketSecurityException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;

import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
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
	public HashMap<String, Object> loadRecent(
			String path,
			HttpSession session) {
		logger.info("서버:recentList 실행 " + path);
		String email = (String) session.getAttribute("loginMem");
		
		 
		HashMap<Integer, FileFolder> all = new HashMap<>();
		//ArrayList<FileFolder> all = new ArrayList<>();// 파일 하나하나가 담길 리스트

		ArrayList<File> myStorageList = new ArrayList<>();// 사용자 컴퓨터의 파일을 담을 리스트
		
		FileManager.findFileRecursive("c:\\freemiere\\" + email, myStorageList);

		ArrayList<FileFolder> sharedList = fileFolderDAO.getSharedList(email);
		// 아래 for문 안에서 findfilerecursive 함수를 호출 하여 모든 파일을 읽어 mystoragelist에
		// add한다.
		for (FileFolder ff : sharedList) {
			FileManager.findFileRecursive(ff.getPath(), myStorageList);// findfilerecursive함수호출
		}
		//DateFormat datepasing = DateFormat.getDateInstance(DateFormat.MEDIUM);
		
		DateFormat format3 = DateFormat.getDateInstance(DateFormat.MEDIUM);
		// vo에 수정날짜 추가. updatedate 추가함
		
		for (File f : myStorageList) {
			String p = f.getAbsolutePath();
			if (f.isDirectory() == true)
				p += "\\";
			
			Date updatedate = new Date(f.lastModified());//모디파이 날짜 형식을 바꿈
			String momodate = format3.format(updatedate);//모드파이 날짜의 형식을 바꾼다 
			

			FileFolder ff = fileFolderDAO.getFilerFolerInfo(p, email);
			if (ff == null)
				continue;
			ff.setIsFolder(f.isDirectory());
			ff.setFileName(f.getName());//파일 이름을 저장한다
			ff.setStrUpdate(format3.format(updatedate));//바뀐형식의  모디파이 날짜를 vo에 저장한다
			ff.setLnUpdate(f.lastModified());
			
			all.put(ff.getFfid(), ff);
			//여기까지 파일 가져오는 부분
		}
		System.out.println("해쉬맴에 담긴 파일"+ all);
		//가져온 파일을 해쉬맴으로 날짜별로 구분해보자 
		//ArrayList<String> dateinfo = new ArrayList<>();
		HashSet<String> dateinfo = new HashSet<>();//날짜정보를 저장할 해시샛, 중복이 허용되지 않아 저장된 중복값은 하나로 된다
		HashMap<String, Object> dateFile = new HashMap<>();
		
		ArrayList<FileFolder> rtn = new ArrayList<FileFolder>(all.values());//모든 파일 정보를 array리스트에 넣는다
		//날짜 정보 저장
		for (FileFolder fileFolder : rtn) {//모든 파일 정보의 날짜 정보를 하나씩 꺼내 hashset에 넣는다. 
			dateinfo.add(fileFolder.getStrUpdate());//날짜정보를 담고 있다 
		}
		System.out.println("날짜정보" + dateinfo);
		
		
		for (String date : dateinfo) {//날짜 정보가 담긴 dateinfo에서 날짜를 하나씩 꺼내본다
		//for (int i=0; i<dateinfo.size(); i++){
			ArrayList<FileFolder> dateFile2 = new ArrayList<>();	
			//String date = dateinfo.get(i);
		for (FileFolder fileFolder : rtn) {//모든 파일 정보를 하나씩 꺼내면서
			if(date.equals(fileFolder.getStrUpdate())){// 날짜 정보와 비교하여 같으면 
					dateFile2.add(fileFolder);//array리스트에 넣는다.
			 	}//if
			}//inner for
		//dateFile.put("length", dateinfo.size());
		//dateFile.put("date" + i, dateFile2);
		System.out.println("해쉬맵의 키값으로 있는 date" + date);
		System.out.println("해쉬맵의 날짜정보를 array에 넣음" + dateFile2);//테스트 출력해보자

		dateFile.put(date, dateFile2);//해쉬맵에 날짜를 키값으로 하고 그날짜에 해당되는  파일 정보(datefile2)를 담는다.
		//해당 날짜에 대한 파일을 가지고 있다 
		}
		
		System.out.println("해쉬맵에 최종 저장 파일??"+ dateFile);
		//테스트 출력 해봄
		/*for (String  date : dateinfo) {//날짜를 가져온다
			ArrayList<FileFolder> test = (ArrayList<FileFolder>) dateFile.get(date);//가져온 날짜를 어레이 리스트에 넣는다.
			System.out.println("날짜 : " +date );//날짜를 출력해본다
			for (FileFolder fileFolder : test) {//가져온 날짜에 해당하는 파일을 모두 가져온다 
				System.out.println(fileFolder);//그 날짜에 해당되는 파일을 출력해본다
			}
			
		}*/
	
		
		Collections.sort(rtn);//오른차순 솔트
		//Iterator<String> filesort = dateFile.keySet().iterator();//해수맵 정렬이라는데....
		//Collections.reverse(rtn);내 림차순 솔트
		
		return dateFile;
		
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
