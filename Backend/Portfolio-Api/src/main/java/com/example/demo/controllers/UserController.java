package com.example.demo.controllers;

import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dao.UserRepo;
import com.example.demo.models.User;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("api/portfolio")
public class UserController {
	
	@Autowired
	UserRepo userrepo;
	
	@PostMapping
	public String addTrade(@RequestBody User user) {
		int sharecount = user.getShares();
		int avg = user.getAvg_buy_value();
		
		User exist = userrepo.findByTickerSymbol(user.getTickerSymbol());
		
		if(exist != null) {
			return "Entry already exists, please update it";
		}
		
		if(sharecount < 0 || avg < 0) {
			return "Please check the number of shares and enter a valid number.";
		}
		userrepo.save(user);
		return "Successfully submited";
	}
	
	@GetMapping
	public List<User> getPortfolio() {
		
		return userrepo.findAll();
	}
	
	@PutMapping("buy/{ts}")
	public String buyShares(@PathVariable("ts") String tickerSymbol, @RequestBody User user) {
		
		int newabv = user.getAvg_buy_value();
		int newcount = user.getShares();
		
		User userToUpdate = userrepo.findByTickerSymbol(tickerSymbol);
		
		int abv = userToUpdate.getAvg_buy_value();
		int count = userToUpdate.getShares();
		
		int totalabv = ((abv*count) + (newabv*newcount))/(count+newcount);
		
		int totalcount = count + newcount;
		
		userToUpdate.setAvg_buy_value(totalabv);
		userToUpdate.setShares(totalcount);
		
		userrepo.save(userToUpdate);
		return "Successfully Updated";
		}
		
	@PutMapping("sell/{ts}")
	public String sellShares(@PathVariable("ts") String tickerSymbol, @RequestBody User user) {
		
		int newcount = user.getShares();
		
		User userToUpdate = userrepo.findByTickerSymbol(tickerSymbol);
		
		int count = userToUpdate.getShares();
		
		int totalcount = count - newcount;
		
		if(count < 0) {
			return "Error detected";
		}
		
		userToUpdate.setShares(totalcount);
		
		userrepo.save(userToUpdate);
		return "Successfully Updated";
		}
	
	@GetMapping("returns")
	public int getReturns() {
		List<User> list = userrepo.findAll();
		int returns = 0;
		for(User u : list) {
			int avg = u.getAvg_buy_value();
			int count = u.getShares();
			returns+= (100 - avg) * count;
		}
		return returns;
	}
	
	@DeleteMapping("{ts}")
	public String deletePortfolio(@PathVariable("ts") String tickerSymbol) {
		User userToDelete = userrepo.findByTickerSymbol(tickerSymbol);
		userrepo.delete(userToDelete);
		return "Deleted Successfully";
	}
}
