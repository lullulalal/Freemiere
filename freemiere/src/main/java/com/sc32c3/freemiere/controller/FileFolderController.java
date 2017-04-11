package com.sc32c3.freemiere.controller;

import java.io.File;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.sc32c3.freemiere.dao.FileFolderDAO;
import com.sc32c3.freemiere.util.FileManager;
import com.sc32c3.freemiere.util.FileService;
import com.sc32c3.freemiere.util.ImageFileManager;
import com.sc32c3.freemiere.vo.FileFolder;
@Controller
public class FileFolderController {

	private static final Logger logger = LoggerFactory.getLogger(FileFolderController.class);

	final String uploadPath = "/freemiere/"; // 파일 업로드 경로

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
	@RequestMapping(value = "loadList", method = RequestMethod.GET, produces = "application/json;charset=utf-8")
	public ArrayList<FileFolder> loadList(String path, HttpSession session) {

		logger.info("서버:loadList 실행 " + path);

		String email = (String) session.getAttribute("loginMem");

		String loadPath = path;
		if (path.charAt(path.length() - 1) != '\\')
			loadPath += "\\";
		System.out.println("1" + loadPath);
		File[] files = FileManager.findFile(loadPath);
		ArrayList<FileFolder> rtn = new ArrayList<>();

		FileManager.fileSort(files);

		for (File f : files) {
			String p = f.getAbsolutePath();
			if (f.isDirectory() == true)
				p += "\\";
			System.out.println("2" + p);
			FileFolder ff = fileFolderDAO.getFilerFolerInfo(p, email);
			if (ff == null)
				continue;
			ff.setIsFolder(f.isDirectory());
			ff.setFileName(f.getName());
			rtn.add(ff);
		}

		return rtn;
	}

	// 휴지통으로 이동
	@ResponseBody
	@RequestMapping(value = "deleteFileFolder", method = RequestMethod.POST)
	public int deleteFileFolder(String[] ffid, String[] isshared, String[] bookState, HttpSession session) {

		/*
		 * logger.debug("ffid={}",ffid); logger.debug("issshared{}",isshared);
		 * logger.debug("book{}",bookState);
		 */

		int result = 0;
		String email = (String) session.getAttribute("loginMem");

		for (int i = 0; i < isshared.length; i++) {

			// 공유 아닌 파일
			if (isshared[i].equalsIgnoreCase("F")) {
				if (bookState[i].equalsIgnoreCase("F")) {
					fileFolderDAO.deleteFileFolder(Integer.parseInt(ffid[i]));
				} else {
					// 공유는 아니고 북파크 표시 폴더
					fileFolderDAO.deleteBookmarks(Integer.parseInt(ffid[i]), bookState[i]);
					fileFolderDAO.deleteFileFolder(Integer.parseInt(ffid[i]));
				}
			} else if (isshared[i].equalsIgnoreCase("T")) {
				if (bookState[i].equalsIgnoreCase("T")) {
					// 공유&북마크폴더
					fileFolderDAO.deleteShare(Integer.parseInt(ffid[i]), email);
					fileFolderDAO.deleteBookmarks(Integer.parseInt(ffid[i]), bookState[i]);
				} else {
					fileFolderDAO.deleteShare(Integer.parseInt(ffid[i]), email);
				}
			}
		}

		return result;
	}


	// 파일폴더업로드
	@ResponseBody
	@RequestMapping(value = "fileUpload", method = RequestMethod.POST)
	public void upload(HttpSession session, MultipartHttpServletRequest upload, String nowPath) {

		if (upload == null)
			System.out.println("폭신폭신 식빵");
		
		String email = (String) session.getAttribute("loginMem");
		if(nowPath.equals("root")) nowPath = "c:\\freemiere\\" + email + "\\"; 
		
		Iterator<String> filesName = upload.getFileNames();
		while (filesName.hasNext()) {
			
			List<MultipartFile> multiFiles = upload.getFiles(filesName.next());

			for (int i = 0; i < multiFiles.size(); i++) {
				System.out.println("길이" + multiFiles.size());
				if (!multiFiles.get(i).isEmpty()) {
					FileFolder file = new FileFolder();
					
					String savefile = FileService.saveFile(multiFiles.get(i), nowPath);
					
					file.setFileName(savefile);
					file.setPath(nowPath + savefile);
					file.setEmail(email);
					
					fileFolderDAO.upload(file);
					
					
					//sms 썸네일 추가. 파일 실제로 삭제 할때 함께 삭제 해야됨~!
					//썸네일 파일 규칙 (영상 + 이미지) : (원본파일이름.확장자.png)
					String ext = ImageFileManager.checkImageFile(savefile);
					if(ext != null){
						ImageFileManager.saveImageFile(
								ImageFileManager.resizeImageHighQuality(nowPath + savefile)
								, ext
								, nowPath+".thumb\\"+savefile+".png");
					}
					else if (ImageFileManager.checkVideoFile(savefile) != null) {
						ImageFileManager.videoThumbGender(nowPath + savefile,
								nowPath+".thumb\\"+savefile+".png");
						ImageFileManager.saveImageFile(
								ImageFileManager.resizeImageHighQuality(nowPath+".thumb\\"+savefile+".png")
								, "png"
								, nowPath+".thumb\\"+savefile+".png");
					}
						
				}//if
			}//for
		}//while

	}
	
// 새폴더
	@ResponseBody
	@RequestMapping(value = "newDir", method = RequestMethod.POST)
	public void newDir(String folderName, String path, HttpSession session) {
		logger.debug("folderName : {}", folderName);
		logger.debug("path : {}", path); //nowPath 현재의 경로
		System.out.println("찌찌파티");
		File directory = new File(path + folderName + "\\");
		if (directory.exists() && directory.isFile()) {
			System.out.println("찌찌파티");
		} else {
			try {
				if (!directory.exists()) {
					//파일을 확인 후 없으면 폴더를 생성한다.
					//mkdirs는 트리구조의 디렉토리를 생성할 수 있다.
					boolean mkdirRst = directory.mkdirs();
					if (mkdirRst == true) {
						String email = (String) session.getAttribute("loginMem");
						fileFolderDAO.newDir(path + folderName + "\\", email);
						
						//sms - 썸네일 폴더 만들기
						File newThumbFolder = new File(path + folderName + "\\" + "." + "thumb\\");
						if(!newThumbFolder.exists())
							newThumbFolder.mkdirs();
					}
				} else {
					System.out.println("이거 실화냐?");
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}
}
